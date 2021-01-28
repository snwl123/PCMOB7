import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import CreateScreen from "./CreateScreen";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function UpcomingScreen() {


  function UpcomingEvents()
  {
    return (
      <View style={commonStyles.container}>
        <Text>Upcoming Events</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator mode="modal" headerMode="false">
      <Stack.Screen component={UpcomingEvents} name = "Upcoming Events"/>
      <Stack.Screen component={CreateScreen} name = "Create Events"/>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
