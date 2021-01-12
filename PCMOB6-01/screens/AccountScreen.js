import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useUsername } from "../hooks/API"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen({ navigation })
{
    const [username, loading, error, refresh] = useUsername();

    // signs out if the useUsername hook returns error as true
    useEffect(() =>
    {
      if (error)
      {
        signOut();
      }
      
    },[error]);

    useEffect(() =>
    {
      const removeListener = navigation.addListener("focus", () => {
        refresh(true);
      });

      return removeListener();

    },[]);

    function signOut()
    {
      AsyncStorage.removeItem("token");
      navigation.navigate("SignIn");
    }
    
    return (
      <View style={commonStyles.container}>
        <Text>Account Screen</Text>
        {loading ? <ActivityIndicator /> : <Text>{username}</Text>}
        <Button title="Sign out" onPress={signOut} />
      </View>
    );
}

const styles = StyleSheet.create({});
