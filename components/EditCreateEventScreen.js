import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { stylesDark } from "../styles/stylesDark";
import { stylesLight } from "../styles/stylesLight";
import { useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format, compareAsc } from 'date-fns';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditCreateEventScreen({navigation, route, eventStatus}) {

  const API = "https:/weilin.pythonanywhere.com";
  const API_EVENTS = "/events";
  const API_WHOAMI = "/whoami";

  const darkLightMode = useSelector((state) => state.pref.darkMode); 

  const [userId, setUserId] = useState(0);

  const [eventName, setEventName] = useState(null);
  const [eventDate, setEventDate] = useState(null); 
  const [timeStart, setTimeStart] = useState(null); 
  const [timeEnd, setTimeEnd] = useState(null); 
  const [timeMode, setTimeMode] = useState(null); 

  const [datePickerVisibility, setDatePickerVisibility] = useState(false); 
  const [timePickerVisibility, setTimePickerVisibility] = useState(false); 

  const [error, setError] = useState(""); 

  const dateInputRef = useRef();
  const startTimeInputRef = useRef();
  const endTimeInputRef = useRef();


  useEffect(() => {

    (async() => {
      const token = await AsyncStorage.getItem("token");
      try {
        const response = await axios.get(API + API_WHOAMI,
        {
            headers: { Authorization: `JWT ${token}` },
        });

        setUserId(response.data.id);
      }
      catch (error) {
          console.log(error)
      }
    })()
    
    if (eventStatus === "Edit Existing Event") {
      navigation.setOptions ({ title: 'Edit Event' })
    }

    const unsubscribe = navigation.addListener('blur', () =>
        {
            setEventName(null);
            setEventDate(null)
            setTimeStart(null);
            setTimeEnd(null)
        },[])

        return unsubscribe;
  },[])

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

  async function addNew(navigation) {
    
    const token = await AsyncStorage.getItem("token");
    try {
      const data = {
        "event_name": eventName,
        "event_date": eventDate.toISOString(),
        "event_start_time": eventDate.toISOString().slice(0,11) + timeStart.toISOString().slice(12),
        "event_end_time": eventDate.toISOString().slice(0,11) + timeEnd.toISOString().slice(12)
      };
    
      const options = {
        headers: { Authorization: `JWT ${token}` }
      };

      await axios.post(API + "/user/" + userId.toString() + API_EVENTS, data, options);
      navigation.navigate("Upcoming")
    }

    catch (error)  {
        console.log(error)
    }
  }

  async function editExisting(navigation) {

    const token = await AsyncStorage.getItem("token");
    try {
        const data = {};

        if (eventName) {
          data["event_name"] = eventName
        }

        if (eventDate) {
          data["event_date"] = eventDate.toISOString()
        }

        if (timeStart) {
          if (eventDate !== null) {
            data["event_start_time"] = eventDate.toISOString().slice(0,11) + timeStart.toISOString().slice(12)
          } 
          else {
            data["event_start_time"] = route.params.currentDate.slice(0,11) + timeStart.toISOString().slice(12)
          }
        }

        if (timeEnd) {
          if (eventDate !== null) {
            data["event_end_time"] = eventDate.toISOString().slice(0,11) + timeEnd.toISOString().slice(12)
          } 
          else {
            data["event_end_time"] = route.params.currentDate.slice(0,11) + timeEnd.toISOString().slice(12)
          }
        }

        console.log(data)
      
        const options = {
          headers: { Authorization: `JWT ${token}` }
        };

        await axios.put(API + API_EVENTS + "/" + route.params.eventId.toString(), data, options)

        navigation.navigate("Upcoming")
      }

      catch (error) {
          console.log(error)
      }
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
                editable={false}
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
          <TouchableOpacity style={styles.createButton} onPress = {eventStatus === "Create New Event"? () => addNew(navigation): () => editExisting(navigation)}>
                        <Text style={styles.createButtonText}>{eventStatus}</Text>
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
