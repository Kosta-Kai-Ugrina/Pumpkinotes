import React, { Component } from "react";
import { View, Text, Button, SafeAreaView, StyleSheet } from "react-native";
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
          options={{ title: "Note List" }}
        />
        <Stack.Screen
          name="Note"
          component={NoteScreen}
          options={{ title: "Note" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
