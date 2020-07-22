import React from 'react'
import {connect} from "react-redux"
import Social from "./Social"
import Form from "../Form/Form"
import buttonField from "../Form/json/buttonField"
import formField from "../Form/json/formField"
import {setResponseMessageError} from "../../actions/actions"

class Signup extends React.Component {

    state={mobile: false}

    componentDidMount() {
        this.props.setResponseMessageError("", `signup`);
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions=()=> {
        if(window.innerWidth >=768){
            this.setState({mobile: false})
        } else{
            this.setState({mobile: true})
        }
        
    }

    renderLoader = () => {
        if (this.props.attemptingResponse) {
            return <div className="ui active inverted dimmer">
                <div className="ui text loader"></div>
            </div>
        }
    }

    render() {
        return (
            <div className="ui placeholder segment">
                <div className="ui two column very relaxed stackable grid">
                    <div className="column">
                        <Form
                            formField={formField}
                            buttonField={buttonField}
                            nameForm={`signup`}
                        />
                    </div>
                    <div className="middle aligned column">
                        <Social nameForm={`signup`}/>
                    </div>
                </div>
                {
                    !this.state.mobile
                    ?
                    <div className="ui vertical divider">
                    Or
                    </div>
                    :
                    null
                }
                {this.renderLoader()}
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        attemptingResponse: state.attemptingResponse[`signup`]
    }

};
export default connect(
    mapStateToProps, {setResponseMessageError}
)(Signup)
