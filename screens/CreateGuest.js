import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback, TextInput, TouchableOpacity, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, compareAsc } from 'date-fns';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function GuestInfoScreen({navigation, route}) {

  const [guestName, setGuestName] = useState("");
  const [noOfGuests, setNoOfGuests] = useState("");
  const [timeStart, setTimeStart] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);
  const [timeMode, setTimeMode] = useState(null); 

  const [guestStatus, setGuestStatus] = useState("Create New Guest"); 

  const [timePickerVisibility, setTimePickerVisibility] = useState(false); 

  const [error, setError] = useState(""); 

  const startTimeInputRef = useRef();
  const endTimeInputRef = useRef();

  const darkLightMode = useSelector((state) => state.pref.darkMode); 

  const API = "https:/weilin.pythonanywhere.com";
  const API_EVENTS = "/events";
  const API_GUESTS = "/guests";

  useEffect(() => {
    if (route.params?.guestId) {
      navigation.setOptions ({ title: 'Edit Existing Guest' })
      setGuestStatus('Edit Existing Guest')
    }
  },[])

  async function addNew(navigation, route) { 

    const token = await AsyncStorage.getItem("token");
    try {
      const data = {
        event_id: route.params.eventId,
        guest_name: guestName,
        no_of_people: noOfGuests,
        guest_start_time: timeStart.toISOString(),
        guest_end_time: timeEnd.toISOString()
      };
      
      const options = {
        headers: { Authorization: `JWT ${token}` }
      };

      const response = await axios.post(API + API_EVENTS + "/" + route.params.eventId.toString() + API_GUESTS, data, options);

      console.log(response)

      navigation.goBack()

    }
    
    catch (error) {
        console.log(error)
    }
  }

  async function editExisting(navigation, route) {

    const token = await AsyncStorage.getItem("token");
    try {
        const data = {};

        if (guestName) {
          data["guest_name"] = guestName
        }

        if (noOfGuests) {
          data["no_of_people"] = noOfGuests
        }

        if (timeStart) {
          data["guest_start_time"] = timeStart.toISOString()
        }

        if (timeEnd) {
          data["guest_end_time"] = timeEnd.toISOString()
        }
        
        const options = {
          headers: { Authorization: `JWT ${token}` }
        };

        await axios.put(API + API_EVENTS + "/" + route.params.eventId.toString() + API_GUESTS + "/" + route.params.guestId.toString(), data, options);

        navigation.goBack()
    }
    
    catch (error) {
        console.log(error)
    }
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
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Guest Name</Text>
          <TextInput
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={guestName}
                onChangeText={(input) => setGuestName(input)}
                />
        </View>

        <View style = {styles.innerContainer}>
          <Text style = {[styles.text, darkLightMode ? stylesDark.text : stylesLight.text]}>Number of Guests</Text>
          <TextInput
                style = {[styles.input,darkLightMode ? stylesDark.input : stylesLight.input]}
                autoCapitalize="none"
                autoCorrect={false}
                value={noOfGuests}
                onChangeText={(input) => setNoOfGuests(input)}
                keyboardType="numeric"
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
            minuteInterval = {15}
            headerTextIOS = "Pick a time"
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
            minuteInterval = {15}
            headerTextIOS = "Pick a time"
        />
        </View>

        <View style = {styles.innerContainer2}>
          <TouchableOpacity style={styles.createButton} onPress = {guestStatus === "Create New Guest"? () => addNew(navigation, route): () => editExisting(navigation, route)}>
                        <Text style={styles.createButtonText}>{guestStatus}</Text>
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
