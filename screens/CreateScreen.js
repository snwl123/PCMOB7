import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux"

export default function CreateScreen({ navigation }) {

  const darkLightMode = useSelector((state) => state.pref.darkMode); 

  return (
    <View style={[commonStyles.container,
                  darkLightMode && { backgroundColor: "#333", color: "#eee" },
                ]}>
      <Text style = {darkLightMode ? stylesDark.text : stylesLight.text}>Create Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
