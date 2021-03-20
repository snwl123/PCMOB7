import React from "react";
import EventScreen from "../components/EventScreen";

export default function UpcomingScreen({navigation}) {
    return <EventScreen navigation={navigation} eventStatus={"past"} />;
}
