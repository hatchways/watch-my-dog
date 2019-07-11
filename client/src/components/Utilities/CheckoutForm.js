import React, { Component } from "react";
import {CardElement, injectStripe} from 'react-stripe-elements';
import {getFromStorage} from './storage';


class CheckoutForm extends Component {
    constructor(props){
      super(props);
      this.state = {
        complete: false,
      };
      this.submit = this.submit.bind(this);
    }
    async submit(ev){
      const token_type = "dog_owner";
      const auth_token = getFromStorage(token_type);

      let {token} = await this.props.stripe.createToken({name:'Name'});
      let response = await fetch("/payment/", {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + auth_token,
            "Content-Type":"application/json"
        },
        body: token.id
      });        
      if (response.ok) this.setState({complete: true});
    }
    render(){
      if (this.state.complete) return <h1>Purchase Complete!</h1>;
      // except errors
  
      return (
        <div className='checkout'>
          <p>Would you like to complete the payment</p>
          <CardElement />
          <button onClick={this.submit}>Send</button>
        </div>
      );
    }
  }

  export default injectStripe(CheckoutForm);