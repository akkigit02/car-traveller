import { applyMiddleware, createStore } from 'redux'
import { thunk } from 'redux-thunk'
const initialState = {};
// import { composeWithDevTools } from 'redux-devtools-extension';
// const composedEnhancer = composeWithDevTools({ trace: true, traceLimit: 25 });

const SET_INTO_STORE = (state, { payload }) => {
    return { ...state, ...payload };
};
const CLEAR_STORE_INFO = () => initialState;
function reducer(state = {}, action) {
    try {
        if (action.type = 'SET_INTO_STORE')
            return SET_INTO_STORE(state, action);
        else CLEAR_STORE_INFO()
    } catch (error) {
        return state;
    }
}
const store = createStore(reducer, initialState, applyMiddleware(thunk))
export default store