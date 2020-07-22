import React, {Component} from 'react'
import Cookies from "js-cookie"
import history from "../../history/History"
import {connect} from "react-redux"
import {authenticatedTest, setDisplayModal} from "../../actions/actions"


class SecurePage extends Component {

    componentDidMount() {
        fetch("/auth/login/success", {
            method     : "GET",
            credentials: "include",
            headers    : {
                Accept                            : "application/json",
                "Content-Type"                    : "application/json",
                "Access-Control-Allow-Credentials": true,
                'Authorization'                   : `${Cookies.get('jwt')}`
            }
        })
            .then(response => {
                if (response.status === 200) return response.json();
                throw new Error(`Their are an error in the authentification process. (${response.statusText})`);
            })
            .then(responseJson => {
                if(!responseJson.success){
                    this.props.setDisplayModal("Authentication is required to access to this page.", true)
                    history.push("/")
                }
            })
            .catch((error) => {
                this.props.setDisplayModal(error.message, true)
                history.push("/")
            });

    }



    render() {
        return (
            
                <React.Fragment>
                    {
                        this.props.authenticated.status
                        ?
                        <div>Route Secure</div>
                        :
                        null
                    }
                </React.Fragment>
                

            
            
        )
    }
}


const mapStateToProps = (state) => {
    return {
        authenticated: state.authenticated
    }

};
export default connect(
    mapStateToProps, {authenticatedTest, setDisplayModal}
)(SecurePage)
