import React, { useEffect, useState } from "react";
import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Svg, Polyline } from "react-native-svg";
import { Note } from "../classes/Note";
import Slider from "@react-native-community/slider";
import { ColorPicker, fromHsv } from "react-native-color-picker";
import { TextInput } from "react-native-gesture-handler";
import Dialog from "react-native-dialog";

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
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentTextBox, setCurrentTextBox] = useState(null);

  useEffect(() => {
    setNote(
      new Note(
        selectedNote.key,
        selectedNote.title,
        selectedNote.lineArray,
        selectedNote.textBoxArray
      )
    );
  }, []);

  console.log(note?.textBoxArray);

  const saveNoteToLocalStorage = async (note) => {
    console.log("ENTER SAVENOTE");
    console.log("SAVING:\n", note.serialize());
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
          if (!dialogVisible) {
            if (!currentTextBox) {
              let temp = note;
              temp.lineArray.push({ color, thickness });
              temp.lineArray[temp.lineArray.length - 1].points = new Array();
              temp.lineArray[temp.lineArray.length - 1].points.push({
                x: x,
                y: y,
              });
              setNote(temp);
            } else {
              let tb = currentTextBox;
              tb.x = x - 100;
              tb.y = y - 100;
              let temp = note;
              if (!temp.textBoxArray) {
                temp.textBoxArray = new Array();
              }
              temp.textBoxArray.push(tb);
              console.log("added to textBoxArray");
              setNote(temp);
              setCurrentTextBox(null);
              saveNoteToLocalStorage(note);
            }
          }
        }}
        onTouchMove={({ nativeEvent: { locationX: x, locationY: y } }) => {
          let temp = note;
          temp.lineArray[temp.lineArray.length - 1].points.push({
            x: x,
            y: y,
          });
          setNote(temp);
          setLineCounter(lineCounter + 1);
        }}
        onTouchEnd={() => {
          console.log("TOUCH END");
          saveNoteToLocalStorage(note);
        }}
      >
        <Svg height="100%" width="100%">
          {note?.lineArray?.map((line) => (
            <Polyline
              points={line.points
                ?.map((point) => point.x.toString() + "," + point.y.toString())
                .join(" ")}
              fill="none"
              stroke={line.color}
              strokeWidth={line.thickness}
            />
          ))}
          <View style={{ width: "100%", height: "100%" }}>
            {note?.textBoxArray?.map((tb) => (
              <TextInput
                value={tb.text}
                style={{
                  position: "absolute",
                  width: tb.width,
                  height: tb.height,
                  top: tb.y,
                  left: tb.x,
                }}
              />
            ))}
          </View>
        </Svg>
      </View>

      <Slider
        value={thickness}
        onValueChange={(val) => {
          setThickness(val);
        }}
        style={{
          width: 200,
          height: 40,
          position: "absolute",
          top: 20,
          alignSelf: "center",
        }}
        minimumValue={5}
        maximumValue={30}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={() => {
          setColorPickerVisible(!colorPickerVisible);
        }}
      >
        <ImageBackground
          source={require("../../assets/paintBrush.png")}
          style={{
            alignSelf: "center",
            width: 25,
            height: 25,
          }}
        />
      </TouchableHighlight>

      {colorPickerVisible && (
        <ColorPicker
          sliderComponent={Slider}
          hideSliders={true}
          onColorChange={(color) => {
            setColor(fromHsv(color));
          }}
          onColorSelected={(color) => alert(`Color selected: ${color}`)}
          style={{
            position: "absolute",
            flex: 1,
            width: 300,
            height: 300,
            alignSelf: "center",
            top: 150,
          }}
        />
      )}

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 80,
          left: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={async () => {
          console.log("ERASER");
          setColor("#ccc");
        }}
      >
        <ImageBackground
          source={require("../../assets/eraser.png")}
          style={{
            alignSelf: "center",
            width: 25,
            height: 25,
          }}
        />
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
        onPress={async () => {
          console.log("UNDO");
          let temp = note;
          console.log(
            "LAST ELEMENT:\n",
            note.lineArray[note.lineArray.length - 1]
          );
          temp.lineArray.pop();
          setNote(temp);
          await AsyncStorage.setItem("note" + note.key, note.serialize());
          setLineCounter(lineCounter + 1);
        }}
      >
        <ImageBackground
          source={require("../../assets/undo.png")}
          style={{
            alignSelf: "center",
            width: 25,
            height: 25,
          }}
        />
      </TouchableHighlight>

      <TouchableHighlight
        style={{
          position: "absolute",
          top: 80,
          right: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={async () => {
          console.log("TEXT BOX");
          setDialogVisible(true);
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            textAlign: "center",
            textAlignVertical: "bottom",
            width: 25,
            height: 25,
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          T
        </Text>
      </TouchableHighlight>

      <Dialog.Container
        contentStyle={{
          position: "absolute",
          alignSelf: "center",
          bottom: 1,
        }}
        visible={dialogVisible}
      >
        <Dialog.Title>Text box</Dialog.Title>
        <Dialog.Description>
          Type the contents below. After that, press on the part of the screen
          where you want to create the textbox.
        </Dialog.Description>
        <Dialog.Input
          autoFocus={true}
          multiline
          numberOfLines={10}
          onChangeText={(text) => {
            if (currentTextBox) {
              let tb = currentTextBox;
              tb.text = text;
              setCurrentTextBox(tb);
            } else {
              setCurrentTextBox({
                x: undefined,
                y: undefined,
                width: 300,
                height: 300,
                text: text,
              });
            }
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            console.log("DIALOG CANCEL CLICK");
            setCurrentTextBox(null);
            setDialogVisible(false);
          }}
        />
        <Dialog.Button
          label="Place textbox"
          onPress={() => {
            console.log("DIALOG PLACE TEXTBOX CLICK");
            setDialogVisible(false);
          }}
        />
      </Dialog.Container>
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
