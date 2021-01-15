import React, { useState} from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux"

export default function CreateScreen({ navigation }) {

  const darkLightMode = useSelector((state) => state.pref.darkMode); 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); 

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View style={[commonStyles.container,
                    darkLightMode && { backgroundColor: "#333", color: "#eee" },
                  ]}>
        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Title</Text>
          <TextInput
                style = {[styles.input1,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={title}
                onChangeText={(input) => setTitle(input)}
                />
        </View>

        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Content</Text>
          <TextInput
                multiline = {true}
                style = {[styles.input2,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={content}
                onChangeText={(input) => setContent(input)}
              />
        </View>

        <View style = {styles.innerContainer2}>
          <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.createButtonText}> Create new post </Text>
          </TouchableOpacity> 
        </View>
      </View>

    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({

  innerContainer:
  {
    marginBottom: 20
  },

  registerButton:
  {
    marginTop: 50
  },

  text:
  {
    fontSize: 13,
    marginBottom: 5,
    fontWeight: "600"
  },

  input2:
  {
    height: 150,
    paddingHorizontal: 5
  },

  innerContainer2:
  {
    width: 250,
    marginTop: 25
  },

  createButton:
  {
    backgroundColor:"#eee",
    width: 125,
    paddingVertical: 7,
    borderRadius: 5
  },

  createButtonText:
  {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600"
  },
});
