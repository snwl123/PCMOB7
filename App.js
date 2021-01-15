import React, { useEffect, useState, useLayoutEffect } from 'react';
import { TouchableOpacity } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen";
import IndexScreen from "./screens/IndexScreen";
import CreateScreen from "./screens/CreateScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/configStore";
import { signInAction, signOutAction } from "./redux/ducks/blogAuth";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

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



  //sign out
  function signOut()
    {
      AsyncStorage.removeItem("token");
      (() => { dispatch(signOutAction()); })();
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
                                                            if (route.name === 'Blog')
                                                            {
                                                                iconName = 'ios-list';
                                                            }
                                                            else if (route.name === 'Profile')
                                                            {
                                                              iconName = focused ? 'person' : 'person-outline';
                                                              size = 20;
                                                            }
                                                            else if (route.name === 'Create post')
                                                            {
                                                              iconName = "add-outline";
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
            <Tab.Screen component={IndexScreen} name="Blog"/>
            <Tab.Screen component={ProfileScreen} name="Profile" />
            <Tab.Screen component={CreateScreen} name="Create post" />
        </Tab.Navigator>
    );

  }



  //sign in & sign up screens
  return (
    <NavigationContainer>
        {signedIn ?
        (
          <Stack.Navigator
              mode="modal"
          >
            <Stack.Screen component={loggedIn} name="loggedIn" options={({route}) => ({ headerTitle: getFocusedRouteNameFromRoute(route) ?? "Blog" })}/>
            {/* <Stack.Screen component={loggedIn} name="loggedIn" options={({route}) => ({ headerTitle: test(route) })}/> */}
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
