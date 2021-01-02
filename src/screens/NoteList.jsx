import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StatusBar,
  TouchableHighlight,
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

  const fillLocalStorage = async () => {
    await AsyncStorage.getAllKeys().then((keys) => {
      AsyncStorage.multiRemove(keys);
    });
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
