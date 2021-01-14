import React, { useEffect, useState } from 'react';
import { StyleSheet } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AccountScreen from "./screens/AccountScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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

  return (
    <NavigationContainer>
      <Stack.Navigator mode="modal" headerMode="none" initialRouteName={signedIn ? "Account" : "SignIn"}>
        <Stack.Screen component={SignInScreen} name="SignIn" />
        <Stack.Screen component={SignUpScreen} name="SignUp" />
        <Stack.Screen component={AccountScreen} name="Account" />
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
