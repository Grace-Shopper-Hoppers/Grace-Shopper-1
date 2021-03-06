import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import product from './product'
import category from './category'
import reviews from './reviews'
import selectedProduct from './selectedProduct'
import selectedCategory from './selectedCategory'
import order from './order'
import categoryProduct from './categoryProduct'


const reducer = combineReducers({user, product, category, order, reviews, selectedProduct, selectedCategory,categoryProduct})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
