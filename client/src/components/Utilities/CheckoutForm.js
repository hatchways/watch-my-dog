import React, { Component } from "react";
import {CardElement, injectStripe} from 'react-stripe-elements';
import {getFromStorage} from './storage';
import axios from 'axios';


class CheckoutForm extends Component {
    constructor(props){
      super(props);
      this.state = {
        complete: false,
      };
      this.submit = this.submit.bind(this);
    }
    async submit(ev){
      const token_type = "dog_sitter";
      const auth_token = getFromStorage(token_type);
      const url = "/payment/";
      let {token} = await this.props.stripe.createToken({name:'Name'});
      let config = {
        method: "POST",
        headers: { Authorization: "Bearer " + auth_token.token },
        data: {
          stripToken: token.id,
          stripeEmail: "test66@t.com" 
        },
        url
      }
      axios(config)
        .then((response)=>{
          console.log(response)
          if (response.ok){
            this.setState({complete: true})
          };
        })       
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