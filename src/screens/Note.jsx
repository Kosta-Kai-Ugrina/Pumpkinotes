import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableHighlight,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Circle, Rect, Path } from "react-native-svg";
import { Note } from "../classes/Note";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function NoteScreen({
  navigation,
  route: {
    params: { selectedNote },
  },
}) {
  const [lineCounter, setLineCounter] = useState(0);
  const [note, setNote] = useState(null);
  const [color, setColor] = useState("#000000");
  const [thickness, setThickness] = useState(5);

  useEffect(() => {
    setNote(
      new Note(selectedNote.key, selectedNote.title, selectedNote.lineArray)
    );
  }, []);

  const saveNoteToLocalStorage = async (note) => {
    try {
      await AsyncStorage.setItem(
        "note" + note.key.toString(),
        note.serialize()
      );
    } catch (e) {
      console.log("ERROR SAVING NOTE TO LOCAL STORAGE");
      console.log(e);
      return false;
    }
    return true;
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flex: 1, backgroundColor: "#ccc" }}
        onTouchStart={({ nativeEvent: { locationX: x, locationY: y } }) => {
          console.log("TOUCH START");
          //console.log("x:", x, "y:", y);
          let temp = note;
          temp.lineArray.push({ x, y, color, thickness });
          setNote(temp);
        }}
        onTouchMove={({ nativeEvent: { locationX: x, locationY: y } }) => {
          //console.log("x:", x, "y:", y);
          let temp = note;
          temp.lineArray.push({ x, y, color, thickness });
          setNote(temp);
          setLineCounter(lineCounter + 1);
        }}
        onTouchEnd={() => {
          console.log("TOUCH END");
          //console.log("ARRAY OF POINTS:", note.lineArray);
          saveNoteToLocalStorage(note);
        }}
      >
        <Svg height="100%" width="100%">
          {note?.lineArray?.map((point) => (
            <Circle
              cx={point.x}
              cy={point.y}
              r={point.thickness}
              fill={point.color}
            />
          ))}
        </Svg>
      </View>

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
        }}
        onPress={() => {
          console.log("RED");
          setColor("#ff0000");
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: "#ff0000",
          }}
        ></View>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 20,
          left: 80,
          height: 40,
          width: 40,
          borderRadius: 20,
        }}
        onPress={() => {
          console.log("BLACK");
          setColor("#000000");
        }}
      >
        <View
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: "#000000",
          }}
        ></View>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={() => {
          console.log("THICC");
          setThickness(20);
        }}
      >
        <View
          style={{
            alignSelf: "center",
            height: 20,
            width: 20,
            borderRadius: 10,
            backgroundColor: "#000000",
          }}
        ></View>
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 20,
          right: 80,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={() => {
          console.log("FINE");
          setThickness(5);
        }}
      >
        <View
          style={{
            alignSelf: "center",
            height: 5,
            width: 5,
            borderRadius: 5,
            backgroundColor: "#000000",
          }}
        ></View>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
