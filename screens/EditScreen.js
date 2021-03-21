import React from "react";
import EditCreateEventScreen from "../components/EditCreateEventScreen";

export default function CreateScreen({navigation, route}) {
  return <EditCreateEventScreen navigation={navigation} route={route} eventStatus={"Edit Existing Screen"}/>;
}
