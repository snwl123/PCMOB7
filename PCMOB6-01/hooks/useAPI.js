import { useState } from "react";
import { Keyboard } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://weilin.pythonanywhere.com";
const API_SIGNUP = "/newuser";
const API_LOGIN = "/auth";

export function useAuth( username, password, confirmPassword, navigationCallback )
{
    const [errorText, setErrorText] = useState("");
    const [loading, setLoading] = useState(false);

    async function signup()
    {
        console.log("------Signup------")
        console.log ("password: " + password)
        console.log ("username: " + username)

        dismissKeyboard();

        if (password !== confirmPassword)
        {
            return [login, signup, setLoading(false),  setErrorText("Password does not match!")]
        }
        else if (password === "" || username === "")
        {
            return [login, signup, setLoading(false),  setErrorText("Missing credentials!")]
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
            setErrorText(error.response.data.description);
            console.log(error);
            if (error.response)
            {
                console.log(error.response);
                setErrorText(error.response.data.description);
            }
        }

        finally
        {
            setLoading(false)
        }
    }

    async function login() {
        console.log("------Login------")
        console.log ("password: " + password)
        console.log ("username: " + username)
        dismissKeyboard();
        
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
        navigationCallback();
        } 

        catch (error)
        {
        console.log("Login Error!");
        console.log(error);
            if (error.response)
            {
                console.log(error.response);
                setErrorText(error.response.data.description);
            }
        }

        finally
        {
            setLoading(false)
        }
    }

    function dismissKeyboard() {
        if (Platform.OS !== "web") {
        Keyboard.dismiss();
        }
    }

    return [login, signup, loading, errorText];
}
