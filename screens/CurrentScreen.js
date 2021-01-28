import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";

export default function CurrentScreen({ navigation }) {
  return (
    <View style={commonStyles.container}>
      <Text>Current Events</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
