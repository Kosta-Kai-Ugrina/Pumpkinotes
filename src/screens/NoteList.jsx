import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
  ImageBackground,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native-gesture-handler";
import { Note } from "../classes/Note";

export default function NoteListScreen({ navigation }) {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    loadNotesFromLocalStorage();
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

  const loadNotesFromLocalStorage = async () => {
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiGet(keys).then((values) => {
          setNotes(values.map((note) => Note.deserialize(note[1])));
        });
      });
    } catch (e) {
      console.log(e);
      console.log("ERROR LOADING NOTE FROM LOCAL STORAGE");
    }
  };

  const clearLocalStorage = async () => {
    await AsyncStorage.getAllKeys().then((keys) => {
      AsyncStorage.multiRemove(keys);
    });
  };

  const fillLocalStorage = async () => {
    await clearLocalStorage();
    saveNoteToLocalStorage(
      new Note(1, "Booger", [
        {
          color: "black",
          thickness: 10,
          points: [
            { x: 30, y: 40 },
            { x: 230, y: 240 },
            { x: 30, y: 340 },
          ],
        },
        {
          color: "red",
          thickness: 5,
          points: [
            { x: 230, y: 40 },
            { x: 200, y: 240 },
            { x: 230, y: 340 },
          ],
        },
      ])
    );
  };

  const createNewNote = async () => {
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
    loadNotesFromLocalStorage();
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#da7",
      }}
    >
      <FlatList
        data={notes}
        style={{ width: "100%" }}
        renderItem={({ item: note }) => {
          return (
            <TouchableHighlight
              style={styles.noteOuterContainer}
              onPress={() =>
                navigation.navigate("Note", {
                  selectedNote: note,
                })
              }
            >
              <View style={styles.noteInnerContainer}>
                <Text style={styles.noteFont}>{note.title}</Text>
              </View>
            </TouchableHighlight>
          );
        }}
      />
      <TouchableHighlight
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          height: 40,
          width: 40,
          borderRadius: 20,
          borderWidth: 2,
          borderColor: "black",
          justifyContent: "center",
        }}
        onPress={async () => {
          console.log("NEW NOTE");
          createNewNote();
        }}
      >
        <ImageBackground
          source={require("../../assets/newNote.png")}
          style={{
            alignSelf: "center",
            width: 20,
            height: 20,
          }}
        />
      </TouchableHighlight>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  noteOuterContainer: {
    flex: 1,
    height: 75,
  },
  noteInnerContainer: {
    flex: 1,
    backgroundColor: "#da2",
    justifyContent: "center",
    borderBottomColor: "#f73",
    borderBottomWidth: 5,
  },
  noteFont: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});
