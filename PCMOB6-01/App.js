import React, { useEffect, useState } from 'react';
import { StyleSheet } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AccountScreen from "./screens/AccountScreen";
import IndexScreen from "./screens/IndexScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();


export default function App() {

  const [loading,setLoading] = useState(false);
  const [signedIn,setSignedIn] = useState(false);

  async function loadToken() {

    const token = await AsyncStorage.getItem("token");
    if (token){
      setSignedIn(true);
    }
    setLoading(false);
  }

  useEffect(() =>
    {
      loadToken();
    }, []);

  const Tab = createBottomTabNavigator();

  function loggedIn()
  {
    return (
        <Tab.Navigator>
            <Stack.Screen component={AccountScreen} name="Account" />
            <Stack.Screen component={IndexScreen} name="Blog" />
        </Tab.Navigator>
    );

  }

  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" headerMode="none" initialRouteName={signedIn ? "Account" : "SignIn"}>
        <Stack.Screen component={loggedIn} name="loggedIn" />
        <Stack.Screen component={SignInScreen} name="SignIn" />
        <Stack.Screen component={SignUpScreen} name="SignUp" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
