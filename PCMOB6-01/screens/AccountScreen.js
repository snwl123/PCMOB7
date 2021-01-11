import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {useState, useEffect} from "react";
import { Button, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { useUsername } from "../hooks/API"

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const getUsernameFromAPI = useUsername(signOut);

  async function getUsername() {
    const nameFromAPI = await getUsernameFromAPI();
    setUsername(nameFromAPI);
  }

  useEffect(() => {
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator size="small"/>);
      getUsername();
    })
    getUsername();
    return removeListener;
  }, []);

  function signOut() {
    AsyncStorage.removeItem("token");
    navigation.navigate("SignIn");
  }

  return (
    <View style={commonStyles.container}>
      <Text>Account Screen</Text>
      <Text>{username}</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({});
