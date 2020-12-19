import React from "react";
import { View, Text, Button } from "react-native";

export default function NoteScreen({ navigation, route }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#afa",
      }}
    >
      <Text>Note screen</Text>
      <Button
        title="Go to List"
        onPress={() => navigation.navigate("NoteList")}
      />
      <Text style={{ fontSize: 30 }}>{route.params.note.val}</Text>
    </View>
  );
}
