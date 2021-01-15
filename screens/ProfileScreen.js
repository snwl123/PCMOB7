import React, { useEffect } from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator, Switch } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useUsername } from "../hooks/API"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux"
import { signOutAction } from "../redux/ducks/blogAuth"
import { toggleDarkMode } from "../redux/ducks/userPref"

export default function ProfileScreen({ navigation })
{
    const [username, loading, error, refresh] = useUsername();
    const dispatch = useDispatch();
    const darkLightMode = useSelector((state) => state.pref.darkMode); 
    

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
      (() => { dispatch(signOutAction()); })();
    }

    
    return (
      <View style={[commonStyles.container,
        darkLightMode && { backgroundColor: "#333", color: "#eee" },
      ]}>
        <Text style = {darkLightMode ? stylesDark.text : stylesLight.text}>Profile</Text>
        {loading ? <ActivityIndicator /> : <Text style = {darkLightMode ? stylesDark.text : stylesLight.text} >{username}</Text>}
        <Switch style = {styles.toggle}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={ darkLightMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => dispatch(toggleDarkMode())}
          value={darkLightMode}
        />
        <Button title="Sign out" onPress={signOut} />
      </View>
    );
}

const styles = StyleSheet.create
({
  toggle:
  {
    marginVertical: 20
  }

});


