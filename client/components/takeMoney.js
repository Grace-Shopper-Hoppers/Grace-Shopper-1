import React from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';
import  { sendEmail } from '../store/email'
import { runInNewContext } from 'vm';
import history from '../history'

import STRIPE_PUBLISHABLE from '../constants/stripe'
import PAYMENT_SERVER_URL from '../constants/server'

// const PAYMENT_SERVER_URL = '/api/stripe/'
// const PAYMENT_SERVER_URL = '/api/stripe/'

const CURRENCY = 'USD';

const updateOrder = async orderId => {
  await axios.put(`/api/order/${orderId}`, {isCart: false, status: 'Processing'})
}

const successPayment = data => {
  console.log("DAAAAATTAAA", data)
  // .then(invoke thunk with (order id))
  alert('Payment Successful');
};

const errorPayment = data => {
  alert('Payment Error');
};

const onToken = (amount, description, email, orderId) => async token =>{
  try{
      await axios.post(PAYMENT_SERVER_URL,
      {
        description,
        source: token.id,
        currency: CURRENCY,
        amount: amount,
        email: email,
        orderId: orderId
      })
      
    }
    catch(err){
      errorPayment()
    }
    try{
      if (orderId){
        updateOrder(orderId)
      } 
      // else {
      //   console.log("HEEEYYYYYYY", sessionStorage)
      //   sessionStorage.clear()
      // }
      sessionStorage.clear()
      history.push('/thank-you')
    }
    catch(err){
      console.error(err)
    }
  }

const Checkout = ({ name, description, amount, receipt_email, customer }) =>
  <StripeCheckout
    name={name}
    // customer={name}
    description={description}
    amount={amount}
    customer={customer}
    token={onToken(amount, description, receipt_email, customer)}
    receipt_email = {receipt_email}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />

export default Checkout;

// import React from 'react'
// import StripeCheckout from 'react-stripe-checkout';
// import axios from 'axios'

// export default class TakeMoney extends React.Component {
//   constructor(props){
//     super(props);
//     this.onToken = this.onToken.bind(this)
//   }
//   onToken(token){
//     console.log('onToken', token)
//     const body = JSON.stringify(token)
//     console.log("stringify", body)
//     //fetch('/api/stripe/', {
//     fetch('/api/stripe/', {
//       method: 'POST',
//       body: token
//       //body: JSON.stringify(token),
//     }).then(response => {
//       response.json().then(data => {
//         console.log("data", data)
//         alert(`We are in business, ${data.email}`);
//       });
//     });
//     // fetch('/api/stripe', 
//     // {
//     //   method: 'POST',
//     //   headers: {
//     //     Accept: 'application/json',
//     //     'Content-Type': 'application/json',
//     //   },
//     //   body: JSON.stringify({
//     //     stripeToken: token.id, 
//     // }).then(res => res.json())
//     //   .then(json => {
//     //     console.log('json', json)
//     //   })
//     // })
//   }
//   render() { 
//     return (
//       <div>
//         <StripeCheckout
//           token={this.onToken()}
//           stripeKey="pk_test_D80U47WaOQUTquFL44fpdXof"
//         />
//       </div>
//     )
//   }
// }
