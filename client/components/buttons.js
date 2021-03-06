import React from 'react'

const Buttons = (props) => {
  const product = props.product;
  // console.log('productBUTTON', product.product)
  let quantity = product.quantity || product.orderProduct.quantity;

  return (
    <div className='btn-quantity'>
       <span>
        <button className="minus-btn"
          type='submit'
          name='decrement'
          value={product.id}
          quantity={quantity}
          onClick={props.handleChange}
          disabled={
            quantity > 1 ? false : true
          }> - </button>
        {quantity}
        <button className="plus-btn"
          type='submit'
          name='increment'
          value={product.id}
          quantity={quantity}
          onClick={props.handleChange}
          disabled={
            quantity < product.inventory ? false : true
          }> + </button>
        </span>
    </div>
  )

}

export default Buttons;
