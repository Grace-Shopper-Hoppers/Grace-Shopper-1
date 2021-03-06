import React from 'react'
import {Link} from 'react-router-dom'
import Buttons from './buttons'
import ToastAddedToCart from './toastNotification'
//import { ToastConsumer, ToastProvider, withToastManager } from 'react-toast-notifications';
import { withToastManager } from 'react-toast-notifications';
import Grid from 'react-bootstrap/lib/Grid'
import Col from 'react-bootstrap/lib/Col'
import Thumbnail from 'react-bootstrap/lib/Thumbnail'
import Row from 'react-bootstrap/lib/Row'
import Button from 'react-bootstrap/lib/Button'

const SingleProduct = (props) => {
  const product = props.orderProduct;

  return (
      <Grid>
        <Row>
          <Col xs={6} md={4}>
          <Thumbnail src={product.imageUrl} alt="242x200" >

          <h3><Link to={`/products/${product.id}`}>

          {product.title}</Link></h3>
          <div className='price'>${((product.price)/100).toFixed(2)}</div>
          <div className='productbtn'>
            <Buttons product={product} orderProduct={props.orderProduct}
            handleChange={props.handleChange} />
            &nbsp;
            <Button bsStyle="default"
                      type='submit' name={product.id} onClick={props.handleSubmit}>
                      Add To Cart</Button>
          </div>
        </Thumbnail>
        <div>
          {
          props.isAdmin &&
          (<Link to={{
            pathname:'/products/edit',
            state: {product}
          }}>Edit</Link>)
        }
        </div>
      </Col>
      </Row>
      </Grid>
  )
}
export default SingleProduct;
