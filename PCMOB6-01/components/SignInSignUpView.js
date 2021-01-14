import React from "react";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { useAuth } from "../hooks/useAPI"

const API = "https://weilin.pythonanywhere.com";
const API_SIGNUP = "/newuser";
const API_LOGIN = "/auth";

export default function SignInSignUpView({ navigation, isSignUp })
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [login, signup, loading, errorText] = useAuth
  (
    username,
    password,
    confirmPassword,
    () => {navigation.navigate("Account")} // function to be run on successful login
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

        <View style={styles.container}>

            <Text style={styles.title}>{isSignUp ? "Register" : "Login"}</Text>

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
            { isSignUp ?
            <Text style={styles.fieldTitle}>Confirm Password</Text>
            : null }
            { isSignUp ?
            <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCompleteType="password"
            autoCorrect={false}
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={(input) => setConfirmPassword(input)}
            />
            : null }

            <View style={styles.innerContainer}>
                <TouchableOpacity onPress={isSignUp ? async() => await signup() :  async() => await login() } style={styles.loginButton}>
                    <Text style={styles.buttonText}> {isSignUp ? "Register" : "Login"} </Text>
                </TouchableOpacity>
                <Text style={styles.loading}>
                    {loading ? <ActivityIndicator size="small"/> : null }
                </Text>
            </View>

            <View style={styles.innerContainer2}>
                <Text style={styles.registerText}> {isSignUp ? "Already registered?" : "Need an account?"} </Text>
                <TouchableOpacity onPress={() =>  { navigation.navigate(isSignUp ? "SignIn" : "SignUp"); }} style={styles.registerButton}>
                    <Text style={styles.registerButtonText}> {isSignUp ? "Login" : "Register"} </Text>
                </TouchableOpacity> 
            </View>

            <Text style={styles.errorText}> {errorText} </Text>
            
        </View>

    </TouchableWithoutFeedback>
  );
  
};

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
      marginBottom: 5
  },

  registerText: {
  textAlign: "left"
  },

  registerButtonText: {
      color: "blue"
  },

  errorText: {
      color: "#ff7e75",
      fontSize: 12
  },

})
