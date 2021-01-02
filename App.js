import React, { Component } from "react";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import NoteScreen from "./src/screens/Note";
import NoteListScreen from "./src/screens/NoteList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "./src/classes/Note";

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
            headerRight: () => <Button title="New" onPress={createNewNote} />,
            headerRightContainerStyle: {
              marginRight: 20,
            },
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

async function createNewNote() {
  const ids = await AsyncStorage.getAllKeys().then((keys) =>
    keys.map((key) => parseInt(key.substring(4, key.length)))
  );
  const maxId = ids == null ? 0 : Math.max(ids);
  const key = "note" + (maxId + 1).toString();
  await AsyncStorage.setItem(
    key,
    new Note(
      maxId + 1,
      "Note " + (maxId + 1).toString(),
      new Array()
    ).serialize()
  );
}
