import {DISPLAY_MODAL} from "../actions/type"

//if display all error (before that we send our form)
export default (state = {status:false, message:""}, action) => {

    switch (action.type) {
        case DISPLAY_MODAL:
            if(action.payload.display===undefined)
            {
                return {...state, status:!state.status, message: action.payload.message}

            } else {

                return {...state, status:action.payload.display, message: action.payload.message}

            }

        default:
            return state
    }
}