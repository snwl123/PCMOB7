import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { commonStyles } from "../styles/commonStyles";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function GuestInfoScreen({ navigation, route }) {

  const [eventId, setEventId] = useState(route.params.event_id)
  const [guests, setGuests] = useState(null)
  const [guestStatus, setGuestStatus] = useState(false)

  const API = "https:/weilin.pythonanywhere.com";
  const API_EVENTS = "/events";
  const API_GUESTS = "/guests";

  useEffect(() => {
    if (route.params?.status === 1) {
      navigation.setOptions({
        headerRight: () => 
          (
            <TouchableOpacity onPress={ () => console.log(navigation.navigate("Create Guest", {eventId}))}>
                <Ionicons
                name="add-outline"
                size={30}
                style={{
                  color: "#111",
                  marginRight: 20,
                }}
              />
            </TouchableOpacity>
          ),
      });
      setGuestStatus(true)
    }
  },[]);

  useEffect(() =>
    {
        
        (async() => {

          try { 
            const token = await AsyncStorage.getItem("token");
            const response = await axios.get(API + API_EVENTS + "/" + eventId.toString() + "/" + API_GUESTS, {
                headers: { Authorization: `JWT ${token}` },
            });

            if (response.data.length !== 0) {
              setGuests(response.data)
            }
          }

          catch (error) {
            console.log(error)
          }

        })()
      
    });

    function editGuest(guestId){
      navigation.navigate("Create Guest", {guestId, eventId})
    }

    async function deleteGuest(guestId) {

      const token = await AsyncStorage.getItem("token");
      try { 
        const options = {
          headers: { Authorization: `JWT ${token}` }
        };
        await axios.delete(API + API_EVENTS + "/" + eventId.toString() + "/" + API_GUESTS + "/" + guestId.toString(), options);
      }
      catch (error) {
          console.log(error)
      }
    }

    function guestInfo({item}) {
      return (
        <View style={styles.eventInfoContainer}>
          <View>
            <Text style={styles.listText1}>{item.guest_name}</Text>
            <Text style={styles.listText2}>{item.no_of_people}</Text>
            <Text style={styles.listText2}>{new Date(item.guest_start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(item.guest_end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</Text>
          </View>
          { guestStatus ?
          <View  style={styles.eventFeatures}>
            <TouchableOpacity onPress={() => editGuest(item.guest_id)}>
              <Ionicons
              name="create-outline"
              size={25}
              style={{
                      color: "#222",
                      marginRight: 20,
                    }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteGuest(item.guest_id)}>
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
          : null}
       </View>
      )
    }


  return (
      <View style={styles.container}>
        {guests?
        <View style={styles.listContainer}>
          <FlatList data = {guests} renderItem = {guestInfo} keyExtractor = {(item) => (item.guest_id).toString()}/>
        </View>
        :
        <Text style={styles.noGuestInfoText}>No Guest Information</Text>
      }
      </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
  },

  listContainer: {
    flex: 1,
    display: "flex",
    backgroundColor: "#fff"
  },

  noGuestInfoText: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "center"
  },

  eventInfoContainer:
    {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomColor: "#bbb",
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



