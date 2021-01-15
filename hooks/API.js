import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

const API = "https:/weilin.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export function useUsername()
{
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);


    useEffect(() =>
    {
        ( async() => {
            setLoading(true);
            const token = await AsyncStorage.getItem("token");
            console.log(token);
            if (token == null)
            {
                setError(true);
                setUsername(null);
            }

            else
            {
                try
                {
                    const response = await axios.get(API + API_WHOAMI,
                    {
                        headers: { Authorization: `JWT ${token}` },
                    });

                    setUsername(response.data.username);
                    setLoading(false);

                }
                
                catch (error)
                {
                    setUsername(null);
                    setError(true);
                    setLoading(false);
                }
            }
        })();

        setRefresh(false);

    },[refresh]);

    return [username, loading, error, setRefresh];

}