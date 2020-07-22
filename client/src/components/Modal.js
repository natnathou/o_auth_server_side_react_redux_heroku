import React from 'react';
import {connect} from "react-redux"
import ReactDOM from 'react-dom'
import {setDisplayModal} from "../actions/actions"


const Modal = props => {
    const display = props.display.status ? "active" : ""    
    const handleClick=()=>{
        props.setDisplayModal()
    }
    return ReactDOM.createPortal(
        <div 
            className={`ui dimmer ${display}`} 
            onClick={handleClick}
        >
            <div 
                className="ui modal active" 
                onClick={e=>e.stopPropagation()}
            >
                <div className="header">
                    <i className="hand point down icon"></i>
                </div>
                    <div className="content">
                    <p>{props.display.message}</p>
                </div>
                <div className="actions">
                    <div 
                        className="ui primary basic button"
                        onClick={()=>handleClick()}
                    >
                        Hide
                    </div>
                </div>
            </div>
        </div>,
        document.querySelector("#modal")
    )
};

const mapStateToProps = (state) => {
    return {
        display: state.displayModal,
        responseErrorMessage: state.responseErrorMessage
    }

};
export default connect(
    mapStateToProps, {setDisplayModal}
)(Modal)
