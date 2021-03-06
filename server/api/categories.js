const router =  require('express').Router();
const { Category, Product } = require('../db/models');
const isAdminMW = (req, res, next) => req.isAdmin ? next() : res.send('Forbidden')
module.exports = router

// GET /api/ all categories
// exact route: GET /api/categories
router.get('/', async(req, res, next) => {
    try{
        const categories = await Category.findAll()
        res.json(categories)
    } catch(err){
        next(err)
    }
})

//SINGLE Category (products associated)
// GET /api/categories/:id
router.get('/:id', async (req, res, next) => {
  try{
      const category = await Category.findById(req.params.id,{
      include: [Product]
  })
  res.send(category)
  } catch(err){
      next(err)
  }
});

//ADMIN can add category 
router.post('/', isAdminMW, async (req, res, next) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (err) {
        next(err);
    }
});

//ADMIN can edit category
router.put('/:categoryid', isAdminMW, async(req, res, next) => {
    try{
        const editedCategory = await Category.update(req.body, {
            where: {
                id: req.params.categoryid
            },
            returning: true,
            plain: true
        });
        res.json(editedCategory)
    }
    catch(err){
        console.error(err)
        next(err)
    }
})
