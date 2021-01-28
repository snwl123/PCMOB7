import React, { useEffect, useState, useLayoutEffect } from 'react';
import { TouchableOpacity } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
// import IndexScreen from "./screens/IndexScreen";
import UpcomingScreen from "./screens/UpcomingScreen";
import CurrentScreen from "./screens/CurrentScreen";
import PastScreen from "./screens/PastScreen";
import CreateScreen from "./screens/CreateScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerActions} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/configStore";
import { signInAction, signOutAction } from "./redux/ducks/blogAuth";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import IndexScreen from './screens/IndexScreen';

const Stack = createStackNavigator();

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
      case 'Current':
        return 'Current Events';
      case 'Past':
        return 'Past Events';
      case 'Settings':
        return 'Settings';
    }
  }


  
  //sign out
  function signOut()
  {
    AsyncStorage.removeItem("token");
    (() => { dispatch(signOutAction()); })();
  }
  

  const Drawer = createDrawerNavigator();

  function Settings() {
    return (
      <Drawer.Navigator
        drawerPosition = "right"
        drawerType="front">
        {/* <Drawer.Screen name="Loggedin" component = {loggedIn} options={({route}) => ({ headerTitle: getHeaderTitle(route) })}/> */}
        <Drawer.Screen name="Profile" component = {ProfileScreen} />
        <Drawer.Screen name="Logout" component = {ProfileScreen}/>
      </Drawer.Navigator>
    );
  }

  function hahaSettings() {
    return (
      <Drawer.Navigator
        drawerPosition = "right"
        drawerType="front">
        {/* <Drawer.Screen name="Loggedin" component = {loggedIn} options={({route}) => ({ headerTitle: getHeaderTitle(route) })}/> */}
        <Drawer.Screen name="Profile" component = {ProfileScreen} />
        <Drawer.Screen name="Logout" component = {ProfileScreen}/>
      </Drawer.Navigator>
    );
  }

  function callSettings()
  {
    return null
  }

  
  //logged in screens
  function loggedIn({ navigation })
  {
    useLayoutEffect(() =>
    {
      navigation.setOptions
      ({  
        headerRight: () =>
        (
          <TouchableOpacity onPress = {signOut}>
            <Ionicons
              name="log-out-outline"
              size={25}
              style={{
                      color: "#222",
                      marginRight: 20,
                    }}
            />
          </TouchableOpacity>
        )
      });
    }, [navigation]);
    

    return (
        <Tab.Navigator screenOptions = {({ route }) => ({
                                                         tabBarIcon: ({ focused, color, size }) =>
                                                         {
                                                            let iconName;
                                                            if (route.name === 'Current')
                                                            {
                                                              iconName = "flash-outline";
                                                            }
                                                            else if (route.name === 'Upcoming')
                                                            {
                                                                iconName = focused ? 'calendar-outline' : 'calendar';
                                                            }
                                                            else if (route.name === 'Past')
                                                            {
                                                              iconName = "alarm-outline";
                                                            }
                                                            else if (route.name === 'Settings')
                                                            {
                                                              iconName = "ios-list";
                                                            }
                                                            else if (route.name === 'Profile')
                                                            {
                                                              iconName = focused ? 'person' : 'person-outline';
                                                              size = 20;
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
            <Tab.Screen component={CurrentScreen} name="Current"/>
            <Tab.Screen component={UpcomingScreen} name="Upcoming"/>
            <Tab.Screen component={PastScreen} name="Past" />
            <Tab.Screen component={callSettings} name="Settings" defaultNavigationOptions={{tabBarOnPress: () => (<Settings />)}}/>
        </Tab.Navigator>
    );

  }



  //sign in & sign up screens
  return (
    <NavigationContainer>
        {signedIn ?
        (
          <Stack.Navigator mode="modal">
            {/* <Stack.Screen component={loggedIn} name="loggedIn" options={({route}) => ({ headerTitle: getFocusedRouteNameFromRoute(route) ?? "Blog" })}/> */}
       
            <Stack.Screen component={loggedIn} name="Current Events" options={({route}) => ({ headerTitle: getHeaderTitle(route) })}/>
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
