import React, { useState, useRef} from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, compareAsc } from 'date-fns'

export default function CreateScreen() {

  const darkLightMode = useSelector((state) => state.pref.darkMode); 
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [timeStart, setTimeStart] = useState(""); 
  const [timeEnd, setTimeEnd] = useState(""); 
  const [timeMode, setTimeMode] = useState(""); 

  const [datePickerVisibility, setDatePickerVisibility] = useState(false); 
  const [timePickerVisibility, setTimePickerVisibility] = useState(false); 

  const [error, setError] = useState(""); 

  const dateInputRef = useRef();
  const startTimeInputRef = useRef();
  const endTimeInputRef = useRef();

  function setNewEventDate(date)
  {
    setEventDate(date);
    setDatePickerVisibility(false);
  }

  function setNewEventTiming(time)
  { 
    setError(null);

    if (timeMode == "startTime")
    {
      if (timeEnd != "" && compareAsc(timeEnd, time) == -1)
      {
        setError("The start time cannot be later than the end time!");
        startTimeInputRef.current.clear();
      }
      else
      {
        console.log((time.toISOString()).replace("T", " "));
        setTimeStart(time)
      }
    }
    else
    {
      if (timeStart != "" && compareAsc(time, timeStart) == -1)
      {
        setError("The end time cannot be later than the start time!");
        endTimeInputRef.current.clear();

      }
      else
      {
        console.log((time.toISOString()).replace("T", " "));
        setTimeEnd(time)
      }
    }

    setTimePickerVisibility(false);

  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View style={[commonStyles.container,
                    darkLightMode && { backgroundColor: "#333", color: "#eee" },
                  ]}>
        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Event Name</Text>
          <TextInput
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={eventName}
                onChangeText={(input) => setEventName(input)}
                />
        </View>

        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Date</Text>
          <TextInput
                ref = { dateInputRef }
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={eventDate? format(eventDate, 'dd/MM/yyyy') : null}
                onTouchStart={() => {Keyboard.dismiss(); setDatePickerVisibility(true)}}
                showSoftInputOnFocus={false}
          />
          <DateTimePickerModal
            isVisible = {datePickerVisibility}
            mode="date"
            onConfirm={setNewEventDate}
            onCancel={() => {setDatePickerVisibility(false)}}
            minimumDate = {new Date()}
            date = {new Date()}
        />
        </View>

        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Start Time</Text>
          <TextInput
                ref = { startTimeInputRef }
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={timeStart? format(timeStart, 'hh:mma') : null}
                editable={false}
                onTouchStart={() => {Keyboard.dismiss(); setTimeMode("startTime"); setTimePickerVisibility(true)}}
                showSoftInputOnFocus={false}
              />
          <DateTimePickerModal
            isVisible = {timePickerVisibility}
            mode="time"
            onConfirm={setNewEventTiming}
            onCancel={() => {setTimePickerVisibility(false)}}
        />
        </View>

        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>End Time</Text>
          <TextInput
                ref = { endTimeInputRef }
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={timeEnd? format(timeEnd, 'hh:mma') : null}
                editable={false}
                onTouchStart={() => {Keyboard.dismiss(); setTimeMode("endTime"); setTimePickerVisibility(true)}}
                showSoftInputOnFocus={false}
              />
          <DateTimePickerModal
            isVisible = {timePickerVisibility}
            mode="time"
            onConfirm={setNewEventTiming}
            onCancel={() => {setTimePickerVisibility(false)}}
        />
        </View>

        <View style = {styles.innerContainer2}>
          <TouchableOpacity style={styles.createButton}>
                        <Text style={styles.createButtonText}>Create New Event</Text>
          </TouchableOpacity> 
        </View>

        <Text style = {styles.errorText}>{error? error: null}</Text>

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

  errorText:
  {
    fontSize: 12,
    fontWeight: "600",
    width: 250,
    marginTop: 35,
    color: "#872929"
  },
});
