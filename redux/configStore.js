import { combineReducers, createStore } from "redux";
import blogAuthReducer from "./ducks/blogAuth";
import userPrefReducer from "./ducks/userPref";

const reducer = combineReducers
({    
    auth: blogAuthReducer,
    pref: userPrefReducer,
})

const store = createStore(reducer);

export default store;