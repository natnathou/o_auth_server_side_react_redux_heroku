import {TEST_AUTHENTICATED} from "../actions/type"



export default (state = false, action) => {

    switch (action.type) {
        case TEST_AUTHENTICATED:
            return {...state, status: action.payload.status, user: action.payload.user, error: action.payload.error}
        default:
            return state
    }
}