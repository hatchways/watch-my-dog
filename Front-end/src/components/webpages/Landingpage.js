import React, { Component } from 'react'

export default class Landingpage extends Component {
    constructor(){
        super();
        this.state={
            currentUser : '',
        }
    }
    componentDidMount(){
        const token = JSON.parse(localStorage.getItem('okta-token-storage'));
        this.setState({
            currentUser : token.idToken.claims.name
        })
    }
    render() {
        return (
            <div>
                <h1>
                    Welcome! {this.state.currentUser}, You Have been Logged In.
                </h1>
            </div>
        )
    }
}
