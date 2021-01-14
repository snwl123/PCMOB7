import { combineReducers, createStore } from "redux";
import blogAuthReducer from "./ducks/blogAuth";

const store = createStore();

const reducer = combineReducers
({    
    auth: blogAuthReducer,
})

export default store;