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
import { Svg, Circle, Rect, Path, Polyline } from "react-native-svg";
import { Note } from "../classes/Note";

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
      console.log(e);
      console.log("ERROR SAVING NOTE TO LOCAL STORAGE");
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
          let temp = note;
          temp.lineArray.push({ color, thickness });
          temp.lineArray[temp.lineArray.length - 1].points = new Array();
          temp.lineArray[temp.lineArray.length - 1].points.push({ x: x, y: y });
          setNote(temp);
        }}
        onTouchMove={({ nativeEvent: { locationX: x, locationY: y } }) => {
          //console.log("x:", x, "y:", y);
          let temp = note;
          temp.lineArray[temp.lineArray.length - 1].points.push({ x: x, y: y });
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
          {note?.lineArray?.map((line) => {
            console.log("LINE: ", line);
            return (
              <Polyline
                points={line.points
                  ?.map(
                    (point) => point.x.toString() + "," + point.y.toString()
                  )
                  .join(" ")}
                fill="none"
                stroke={line.color}
                strokeWidth={line.thickness}
              />
            );
          })}
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
