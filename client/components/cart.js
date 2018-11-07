import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import product from '../store/product'
import { gotAllOrders, deleteFromCart, changeQuantity, getNewPrice, applyPromo } from '../store/order'
import { me } from '../store/user'
import CartItems from './cartItems'
import PromoCode from './promoCode'

class Cart extends Component {
  constructor() {
    super()
    this.state = {
      orderProduct: [],
      isLoggedIn: false,
      orders: {},
      promoCode: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handlePromoSubmit = this.handlePromoSubmit.bind(this)
    this.total = this.total.bind(this)
  }

  async componentDidMount() {
    await this.props.me()

    if (this.props.user.id) {
      await this.props.gotAllOrders(Number(this.props.user.id))
      this.setState({ orderProduct: this.props.order.products, promoCode: this.props.order.promo })

    } else {
      const orderProduct = JSON.parse(sessionStorage.getItem('orderProduct'));
      if (orderProduct) {
        this.setState({ orderProduct })
      }

      this.setState({ isLoggedIn: false })

    }
  }

  handleChange(evt) {
    const productId = Number(evt.target.value);
    const PlusOrMinus = evt.target.name;
    const [orderProductInLocalState] = this.state.orderProduct.filter(product => product.id === productId);
    let newState;

    if (this.props.user.id) {
      PlusOrMinus === 'increment'
        ? orderProductInLocalState.orderProduct.quantity++
        : orderProductInLocalState.orderProduct.quantity--;

      const updatedQuantity = orderProductInLocalState.orderProduct.quantity;

      this.props.changeQuantity({
        quantity: Number(updatedQuantity),
        productId: Number(orderProductInLocalState.id),
        orderId: Number(this.props.order.id),
        userId: Number(this.props.user.id)
      })

      newState = this.state.orderProduct.map(product => {
        if (product.id === productId) {
          return orderProductInLocalState
        } else {
          return product
        }
      })

      this.setState({
        orderProduct: newState
      })
    } else {
      PlusOrMinus === 'increment'
        ? orderProductInLocalState.quantity++
        : orderProductInLocalState.quantity--;
      newState = this.state.orderProduct.map(product => {
        if (product.id === productId) {
          return orderProductInLocalState
        } else {
          return product
        }
      })
      sessionStorage.setItem('orderProduct', JSON.stringify(newState))
      this.setState({
        orderProduct: newState
      })
    }
  }

  handlePromoSubmit(e){
    e.preventDefault()
    const promoCode = e.target.promoCode.value
    if(promoCode === 'Luigi50'){
      this.setState({promoCode})

      const newTotal = this.total(promoCode)
      if(this.props.order){
        const applyPromoObj = {
          newTotal,
          orderId: Number(this.props.order.id),
          promoCode
        }
        this.props.applyPromo(applyPromoObj)
      }
    }
  }

  handleSubmit(evt) {
    evt.preventDefault()
    const productId = Number(evt.target.name);
    const userId = Number(this.props.user.id)

    if (this.props.user.id) {
      const infoForDelete = { productId, userId }
      this.props.deleteFromCart(infoForDelete)
      this.props.getNewPrice(Number(this.props.user.id))
      this.props.history.push('/cart/')
    } else {
      const orderProductSession = JSON.parse(sessionStorage.getItem('orderProduct'));
      let newOrderProductSession = orderProductSession.filter(prod => prod.id !== productId)
      sessionStorage.setItem('orderProduct', JSON.stringify(newOrderProductSession))
      this.setState({ orderProduct: newOrderProductSession })
    }
  }

  total(promo) {
    const orderProducts = this.props.user.id ? this.props.order.products : this.state.orderProduct
    let total;
    if (orderProducts) {
      total = orderProducts.reduce((sumTotal, orderProduct) => {
        let productTotal;
        if (this.props.user.id) {
          productTotal = orderProduct.orderProduct.quantity * orderProduct.price
        } else {
          productTotal = orderProduct.quantity * orderProduct.price
        }
        return sumTotal + productTotal
      }, 0)
    }
    total = ((total) / 100).toFixed(2)
    if(promo === 'Luigi50' || this.state.promoCode === 'Luigi50') {
      return (total/2).toFixed(2)
    } else {
      return total ? total : 0
    }
  }

  render() {
    if (this.props.user.id && this.props.order) {
      return (
        <div className='shopping-cart'>
          <div className='title'>
            <h2> Shopping Cart </h2>
          </div>
         {
          this.state.promoCode &&
          <div>
            <h2>Promo Code Applied: {this.state.promoCode}</h2>
          </div>
         }
          {
            this.props.order.products && this.props.order.products.map(
              (aProduct) => <CartItems
                key={aProduct.id}
                order={this.order}
                orderProduct={aProduct}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                user={this.user} />

            )}
          <div className='promo-checkout'>
            <PromoCode handlePromoSubmit={this.handlePromoSubmit} promoCode={this.state.promoCode} />
            <ul>
              <li><h2>Total Price: ${this.total()}</h2></li>
              <li><Link to='/checkout'><button className='checkout' type='submit' onSubmit={this.handleSubmit}>Checkout</button></Link></li>
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <div className='shopping-cart'>
          <div className='title'>
            <h2>Shopping Cart</h2>
          </div>
          {
          this.state.promoCode &&
          <div>
            <h2>Promo Code Applied: {this.state.promoCode}</h2>
          </div>
         }
          <div>
          {
            this.state.orderProduct && this.state.orderProduct.map(orderProduct => <CartItems key={product.id} orderProduct={orderProduct} handleChange={this.handleChange} handleSubmit={this.handleSubmit} user={this.user} />
            )
          }
          </div>
          <div className='promo-checkout'>
            <PromoCode handlePromoSubmit={this.handlePromoSubmit} promoCode={this.state.promoCode} />
            <ul>
              <li><h2>Total Price: ${this.total()}</h2></li>
              <li><Link to='/checkout'><button className='checkout' type='submit' onSubmit={this.handleSubmit}>Checkout</button></Link></li>
            </ul>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = (state) => {
  return {
    order: state.order,
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    gotAllOrders: (user) => dispatch(gotAllOrders(user)),
    deleteFromCart: (aProduct) => dispatch(deleteFromCart(aProduct)),
    changeQuantity: (quantity) => dispatch(changeQuantity(quantity)),
    getNewPrice: (orderid) => dispatch(getNewPrice(orderid)),
    me: () => dispatch(me()),
    applyPromo: (promoObj) => dispatch(applyPromo(promoObj))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
