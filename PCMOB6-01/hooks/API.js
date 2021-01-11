import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https:/weilin.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export function useUsername(signOutCallback)
{
    async function getUsername() {
        console.log("---- Getting user name ----");
        const token = await AsyncStorage.getItem("token");
        console.log(`Token is ${token}`);
        try {
        const response = await axios.get(API + API_WHOAMI, {
            headers: { Authorization: `JWT ${token}` },
        });
        console.log("Got user name!");
        return (response.data.username);
        } catch (error)
        {
            console.log("Error getting user name");
            if (error.response)
            {
                console.log(error.response.data);
                if (error.response.data === 401)
                {
                    signOutCallback();
                }
            } 
            else
            {
                console.log(error);
            }
        }
    }

        return getUsername;
    }