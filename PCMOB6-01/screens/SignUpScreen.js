import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from "react-native";
import axios from "axios";

const API = "https://weilin.pythonanywhere.com";
const API_SIGNUP = "/newuser";
const API_LOGIN = "/auth";

export default function SignInScreen({ navigation })
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup() {
    console.log("------Signup------")
    Keyboard.dismiss();

    if (password !== confirmPassword)
    {
      setLoading(false)
      return (setErrorText("Password does not match!"))
    }
    
    try
    {
      setLoading(true)
      setErrorText("")
      const response = await axios.post(API + API_SIGNUP,
      {
        username,
        password,
      });
      console.log("Registration success!");
      console.log(response);
      login();
    } 

    catch (error)
    {
      console.log("Registration Error!");
      console.log(error.response);
      setLoading(false)
      setErrorText(error.response.data.description);
    }
  }

  async function login() {
    console.log("------Login------")
    
    try
    {
      setLoading(true)
      setErrorText("")
      const response = await axios.post(API + API_LOGIN,
      {
        username,
        password,
      });
      console.log("Login success");
      console.log(response);

      await AsyncStorage.setItem("token", response.data.access_token);
      setLoading(false)
      navigation.navigate("Account");
    } 

    catch (error)
    {
      console.log("Login Error!");
      console.log(error.response);
      setLoading(false)
      setErrorText(error.response.data.description);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.fieldTitle}>Username</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={(input) => setUsername(input)}
        />
        <Text style={styles.fieldTitle}>Password</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={(input) => setPassword(input)}
        />
        <Text style={styles.fieldTitle}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="password"
          autoCorrect={false}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(input) => setConfirmPassword(input)}
        />
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={signup} style={styles.loginButton}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.loading}>{loading ? <ActivityIndicator size="small"/> : null }</Text>
        </View>
        <View style={styles.innerContainer2}>
          <Text style={styles.registerText}>Already registered?</Text>
          <TouchableOpacity onPress={ () => {navigation.navigate("SignIn")} } style={styles.registerButton}>
            <Text style={styles.registerButtonText}>Sign in.</Text>
          </TouchableOpacity> 
        </View>
        <Text style={styles.errorText}>{errorText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },

  innerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 36,
  },

  loading: {
    marginLeft: 30
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },

  fieldTitle: {
    fontSize: 18,
    marginBottom: 12,
  },

  input: {
    borderColor: "#999",
    borderWidth: 1,
    marginBottom: 24,
    padding: 4,
    height: 36,
    fontSize: 18,
    backgroundColor: "white",
  },

  loginButton: {
    backgroundColor: "blue",
    width: 120,
    alignItems: "center",
    padding: 18
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  innerContainer2: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 36
  },

  registerText: {
  textAlign: "left"
  },

  registerButton: {
    marginLeft: 5
  },

  registerButtonText: {
    color: "blue"
  },

  errorText: {
    color: "red",
    height: 40,
  },
});
