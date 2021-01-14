import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NoteScreen from "./src/screens/Note";
import NoteListScreen from "./src/screens/NoteList";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="NoteList"
          component={NoteListScreen}
          options={{
            title: "Note List",
            headerStyle: {
              backgroundColor: "#da2",
              borderBottomWidth: 5,
              borderBottomColor: "#f73",
            },
          }}
        />
        <Stack.Screen
          name="Note"
          component={NoteScreen}
          options={{
            title: "Note",
            headerStyle: {
              backgroundColor: "#da2",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
