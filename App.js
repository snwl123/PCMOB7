import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CreateScreen from "./screens/CreateScreen";
import UpcomingScreen from "./screens/UpcomingScreen";
import GuestInfoScreen from "./screens/GuestInfoScreen";
import CreateGuest from "./screens/CreateGuest";
import EditScreen from "./screens/EditScreen";
import PastScreen from "./screens/PastScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/configStore";
import { signInAction } from "./redux/ducks/blogAuth";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

const Stack = createStackNavigator();

const API = "https:/weilin.pythonanywhere.com";
const API_WHOAMI = "/whoami";

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App()
{
  const [loading,setLoading] = useState(false);
  const [userId, setUserId] = useState(0)
  const dispatch = useDispatch();
  const signedIn = useSelector((state) => state.auth.signedIn); // before: [] = useState()

  async function loadToken() {
    const token = await AsyncStorage.getItem("token");
    if (token){
      dispatch(signInAction()); // before: setSignIn(true)
    }
    setLoading(false);
  }


  useEffect(() =>
  {
    loadToken();

  }, []);


  const Tab = createBottomTabNavigator();

  function getHeaderTitle(route) {
    // If the focused route is not found, we need to assume it's the initial screen
    // This can happen during if there hasn't been any navigation inside the screen
    // In our case, it's "Feed" as that's the first screen inside the navigator
    const routeName = getFocusedRouteNameFromRoute(route);
  
    switch (routeName) {
      case 'Upcoming':
        return 'Upcoming Events';
      case 'Create Event':
        return 'Create Event';
      case 'Past':
        return 'Past Events';
      case 'Profile':
        return 'Profile';
    }
  }
  
  //logged in screens
  function loggedIn()
  {
    return (
        <Tab.Navigator screenOptions = {({ route }) => ({
                                                         tabBarIcon: ({ focused, color, size }) =>
                                                         {
                                                            let iconName;
                                                            if (route.name === 'Create Event')
                                                            {
                                                              iconName = focused ? "add-circle" : "add-circle-outline";
                                                            }
                                                            else if (route.name === 'Upcoming')
                                                            {
                                                                iconName = focused ? 'calendar' : 'calendar-outline';
                                                            }
                                                            else if (route.name === 'Past')
                                                            {
                                                              iconName =  focused ? 'alarm' : "alarm-outline";
                                                            }
                                                            else if (route.name === 'Profile')
                                                            {
                                                              iconName = focused? "person" : "person-outline";
                                                            }

                                                            return <Ionicons name={iconName} size={size} color={color} />;
                                                         },
                                                       })}

                        tabBarOptions = {{
                                          activeTintColor: '#4287f5',
                                          inactiveTintColor: 'gray',
                                          labelStyle: {
                                            fontSize: 10,
                                            fontWeight: "600",
                                          },
                                        }}>
            <Tab.Screen component={UpcomingScreen} name="Upcoming"/>
            <Tab.Screen component={PastScreen} name="Past" />
            <Tab.Screen component={CreateScreen} name="Create Event"/>
            <Tab.Screen component={ProfileScreen} name="Profile"/>
        </Tab.Navigator>
    );

  }


  function GuestScreen() {
    return (
      <Stack.Navigator mode="modal">
              <Stack.Screen component={GuestInfoScreen} name="Guest Information"/>
              <Stack.Screen component={CreateGuest} name="Create Guest"/>
      </Stack.Navigator>
    );
  }
  

  //sign in & sign up screens
  return (
    <NavigationContainer>
        {signedIn ?
        (
          <Stack.Navigator mode="modal">
            <Stack.Screen component={loggedIn} name="Upcoming Events" options={({route, navigation}) => ({ headerTitle: getHeaderTitle(route) })}/>
            <Stack.Screen component={GuestScreen} name="Guest Screen" options={{ headerShown: false }}/>
            <Tab.Screen component={EditScreen} name="Edit Event"/>
          </Stack.Navigator>
        )
        :
        (
          <Stack.Navigator
              mode="modal"
              headerMode="none"
          >
            <Stack.Screen component={SignInScreen} name="SignIn" />
            <Stack.Screen component={SignUpScreen} name="SignUp" />
          </Stack.Navigator>
        )}
    </NavigationContainer>
  );
}
