import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import axios from "axios";
import { compareAsc } from 'date-fns'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const API = "https:/weilin.pythonanywhere.com";
const API_EVENTS = "/events";

export default function EventScreen({navigation, eventStatus}) {

  const [events, setEvents] = useState([])
  const [status, setStatus] = useState(0)

  useEffect(() =>
  {
    
      if (eventStatus == "upcoming") {
          setStatus(1)
      }
      else if (eventStatus == "past") {
          setStatus(-1)
      }
      else {
          setStatus(0)
      }
    
  },[]);
  
    useEffect(() =>
    {
        
        (async() => {

          const token = await AsyncStorage.getItem("token");
          try { 
            const response = await axios.get(API + API_EVENTS,
            {
                headers: { Authorization: `JWT ${token}` },
            });

            setEvents(response.data);
          }
          
          catch (error) {
            console.log(error)
          }
        })()
      
    },[events]);

    function createGuest(status, event_id) {
      navigation.navigate("Guest Screen", {screen: 'Guest Information', params: { status: status, event_id: event_id }})
    }

    async function deleteEvent(eventId) {

      const token = await AsyncStorage.getItem("token");
      try { 
          const options = {
            headers: { Authorization: `JWT ${token}` }
          };
          const response = await axios.delete(API + API_EVENTS + "/" + eventId.toString(), options);
          console.log(response)
      }
      catch (error) {
          console.log(error)
      }

    }

    function editEvent(eventId, currentDate) {
      navigation.navigate("Create Event", {eventId, currentDate})
    }

    function eventInfo( {item} )
    { 
        return(
        <View>
          { compareAsc(new Date(item.event_start_time), new Date()) === status?
            <View style={styles.eventInfoContainer}>
              <TouchableOpacity onPress = {() => createGuest(status, item.event_id)}>
                  <Text style={styles.listText1}>{new Date(item.event_start_time).toLocaleDateString('en-GB')}</Text>
                  <Text style={styles.listText2}>{item.event_name}</Text>
                  <Text style={styles.listText2}>{new Date(item.event_start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.event_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
              </TouchableOpacity >
              <View  style={styles.eventFeatures}>
              { status === 1?
                <TouchableOpacity onPress={() => editEvent(item.event_id, new Date(item.event_start_time).toISOString())}>
                  <Ionicons
                  name="create-outline"
                  size={25}
                  style={{
                          color: "#222",
                          marginRight: 20,
                        }}
                  />
                </TouchableOpacity>
                : null}
                <TouchableOpacity onPress={() => deleteEvent(item.event_id)}>
                  <Ionicons
                  name="trash-outline"
                  size={25}
                  style={{
                          color: "#222",
                          marginRight: 20,
                        }}
                  />
                </TouchableOpacity>
              </View>
          </View>
          : null}
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <FlatList data = {events} renderItem = {eventInfo} keyExtractor = {(item) => (item.event_id).toString()}/>
      </View>
    );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "left"
  },

  eventInfoContainer:
    {
      display: "flex",
      flexDirection: "row",
      borderBottomColor: "#bbb",
      justifyContent:"space-between",
      borderBottomWidth: 0.2,
      padding: 20
    },

    eventFeatures:
    {
      display: "flex",
      flexDirection: "row",
      alignItems:"center"
    },

    listText1:
    {
      fontWeight: "600",
      color: "#222"
    },

    listText2:
    {
      color: "#555",
      marginTop: 5
    }
  
});
