import React, {Component} from 'react'
import Cookies from "js-cookie"
import {connect} from "react-redux"
import {Link} from "react-router-dom"
import {authenticatedTest, setDisplayModal} from "../../actions/actions"


class Header extends Component {
    constructor(props){
        super(props)
        this.refPushable = React.createRef()
        this.refToggle = React.createRef()
    }
    state = {
        toggle       : false
    }



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
                throw new Error(`Their are an error in the authentication process. (${response.statusText})`);
            })
            .then(responseJson => {
                this.props.authenticatedTest(responseJson.success, responseJson.user, responseJson.error)
            })
            .catch(error => {
                this.props.authenticatedTest(false, false, error.message)
                this.props.setDisplayModal(error.message, true)

            });

            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions);
            window.addEventListener('click', this.onBodyClick);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('click', this.onBodyClick);
      }
      
    updateWindowDimensions=()=> {
          if(window.innerWidth >=992){
            this.setState({toggle: false})
          }
      }

      onBodyClick = (event) => {
        if (this.refToggle.current.contains(event.target)) {
          return;
        }
  
        this.setState({toggle: false})
      };
  

    Toggle = () => {
        this.setState({toggle: !this.state.toggle})

    };

    handleClick = () => {
        this.setState({toggle: false})
    };

    _handleLogout = () => {
        window.open(`${process.env.REACT_APP_URL_SERVER}/auth/logout`, "_self");
        Cookies.set('jwt', false);
    };


    render() {
        return (
            <div>
                <div className="ui grid">
                    {/*for bigScreen*/}
                    <div className="computer only row">
                        <div className="column">
                            <div className="ui secondary pointing menu">
                                <Link to="/" className="item">
                                    <h2>
                                        OAuth
                                    </h2>
                                </Link>
                                <h4 className="right menu">
                                        <div className="item">
                                            <Link to="/" className="item">
                                                Home
                                            </Link>
                                        </div>
                                        {
                                        this.props.authenticated.status 
                                            ?                                                
                                            <div className="item">
                                                <Link to="/secure" className="item">
                                                    Secure
                                                </Link>
                                            </div>
                                            :
                                            null
                                        }
                                                                         
                                        {
                                        !this.props.authenticated.status
                                            ?
                                            <div className="item">   
                                                
                                            <Link to="/login" className="item">
                                                <button className="ui teal button">
                                                    Login
                                                </button>                                                    
                                            </Link>
                                            </div>
                                            :
                                            null
                                        }
                                        {
                                        !this.props.authenticated.status
                                            ?
                                            <div className="item">
                                        
                                            <Link to="/signup" className="item">
                                                <button className="ui twitter button">
                                                    Signup
                                                </button>
                                            </Link>
                                            </div>
                                            :
                                            <div className="item">
                                            <Link 
                                            to=""
                                            className="item" 
                                            onClick={this._handleLogout} 
                                            >
                                                <button className="ui negative basic button">
                                                    Logout
                                                </button>
                                            </Link>
                                            </div>
                                        }
                                   
                                </h4>
                            </div>
                        </div>
                    </div>
                    {/*for smallScreen*/}
                    <div className="tablet mobile only row">
                        <div className="column">
                            <div className="ui secondary pointing menu">
                                <Link to="/" className="item">
                                    <h2>
                                        oAuth
                                    </h2>
                                </Link>
                                <div className="right menu">
                                    <div className="item" ref={this.refToggle}>
                                        <div 
                                            id="mobile_item" 
                                            className="item" 
                                            onClick={this.Toggle}
                                            style={{cursor: `pointer`}}
                                            >
                                            <i className="bars icon"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                {
                    this.state.toggle
                        ?
                        <div className="overflowCondition containerPushable">
                            <div className="Pushables" ref={this.refPushable} onClick={this.handleClick}>
                                <div className="ui floated right">
                                    <div className="ui vertical menu">
                                        <Link to="/" className="ui item button buttonHamburgerLink">
                                            Home
                                        </Link>
                                        {
                                        this.props.authenticated.status 
                                            ?
                                                
                                            <Link to="/secure" className="ui item button buttonHamburgerLink">
                                                Secure
                                            </Link>
                                            :
                                            null
                                        }
                                        {
                                        !this.props.authenticated.status 
                                            ?
                                                
                                            <Link to="/login" className="ui teal button item connectButton buttonHamburgerLink">
                                                Login
                                            </Link>
                                            :
                                            null
                                        }
                                        {
                                        !this.props.authenticated.status 
                                            ?
                                        
                                            <Link to="/signup" className="ui item button blue-twitter connectButton buttonHamburgerLink">
                                                Signup
                                            </Link>
                                            :
                                            <Link 
                                                to="" 
                                                className="ui red button connectButton item buttonHamburgerLink"  
                                                onClick={this._handleLogout}
                                                >
                                               Logout                                                    
                                            </Link>
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
            
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
)(Header)
