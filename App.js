import React, { useEffect, useState, useLayoutEffect } from 'react';
import { TouchableOpacity } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AccountScreen from "./screens/AccountScreen";
import IndexScreen from "./screens/IndexScreen";
import CreateScreen from "./screens/CreateScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/configStore";
import { signInAction, signOutAction } from "./redux/ducks/blogAuth";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App()
{

  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.auth.signedIn); // before: [] = useState()



  async function loadToken() {
    const token = await AsyncStorage.getItem("token");
    if (token){
      dispatch(signInAction()); // before: setSignIn(true)
    }
    setLoading(false);
  }

  

  useEffect(() =>
  {
    loadToken();
  }, []);

  const Tab = createBottomTabNavigator();



  //sign out
  function signOut()
    {
      AsyncStorage.removeItem("token");
      (() => { dispatch(signOutAction()); })();
    }


  //logged in screens
  function loggedIn({ navigation })
  {
    useLayoutEffect(() =>
    {
      navigation.setOptions
      ({  
        headerRight: () =>
        (
          <TouchableOpacity onPress = {signOut}>
            <Ionicons
              name="log-out-outline"
              size={25}
              style={{
                      color: "#222",
                      marginRight: 20,
                    }}
            />
          </TouchableOpacity>
        )
      });
    }, [navigation]);

    return (
        <Tab.Navigator>
            <Tab.Screen component={IndexScreen} name="Blog"/>
            <Tab.Screen component={AccountScreen} name="Account" />
            <Tab.Screen component={CreateScreen} name="Create" />
        </Tab.Navigator>
    );

  }



  //sign in & sign up screens
  return (
    <NavigationContainer>
        {signedIn ?
        (
          <Stack.Navigator
              mode="modal"
          >
            <Stack.Screen component={loggedIn} name="loggedIn" options={({route}) => ({ headerTitle: getFocusedRouteNameFromRoute(route) ?? "Blog" })}/>
            {/* <Stack.Screen component={loggedIn} name="loggedIn" options={({route}) => ({ headerTitle: test(route) })}/> */}
          </Stack.Navigator>
        )
        :
        (
          <Stack.Navigator
              mode="modal"
              headerMode="none"
          >
            <Stack.Screen component={SignInScreen} name="SignIn" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
          </Stack.Navigator>
        )}
    </NavigationContainer>
  );
}
