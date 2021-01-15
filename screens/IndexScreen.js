import React from "react";
import { Text, View } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux"

export default function IndexScreen({ navigation })
{

  const darkLightMode = useSelector((state) => state.pref.darkMode); 

  return (
    <View style={[commonStyles.container,
                  darkLightMode && { backgroundColor: "#333", color: "#eee" },
                ]}>
      <Text style = {darkLightMode ? stylesDark.text : stylesLight.text}>Index Screen</Text>
    </View>
  );
}