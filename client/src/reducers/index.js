import {combineReducers} from 'redux'
import formValueReducer from './formValueReducer'
import formPropsReducer from './formPropsReducer'
import formErrorReducer from "./formErrorReducer"
import responseErrorMessageReducer from "./responseErrorMessageReducer"
import attemptingResponseReducer from "./attemptingResponseReducer"
import authenticatedReducer from "./authenticatedReducer"
import displayModalReducer from "./displayModalReducer"


export default combineReducers({
    formValue           : formValueReducer,
    formProps           : formPropsReducer,
    displayError        : formErrorReducer,
    responseErrorMessage: responseErrorMessageReducer,
    attemptingResponse  : attemptingResponseReducer,
    authenticated       : authenticatedReducer,
    displayModal : displayModalReducer
})