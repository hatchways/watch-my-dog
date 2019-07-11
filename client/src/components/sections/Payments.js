import React, { Component } from "react";
import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from '../Utilities/CheckoutForm';


export default class Payments extends Component {
  render(){
    return(
      <StripeProvider apiKey='pk_test_OjA3brSItrBZugiJgaXYiuM1004IFPQo0H'>
        <div className='example'>
          <h1>Stripe payment form</h1>
          <Elements>
            <CheckoutForm />
          </Elements>
        </div>
      </StripeProvider>
    );
  }
}
