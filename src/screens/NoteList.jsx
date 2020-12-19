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

export default function NoteListScreen({ navigation }) {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    loadNotesFromLocalStorage();
  }, []);

  const saveNoteToLocalStorage = async (id, note) => {
    try {
      await AsyncStorage.setItem("note" + id.toString(), note.toString());
    } catch (e) {
      console.log("ERROR SAVING NOTE TO LOCAL STORAGE");
      console.log(e);
      return false;
    }
    return true;
  };

  const loadNotesFromLocalStorage = async () => {
    let notes = [];
    try {
      AsyncStorage.getAllKeys().then((keys) => {
        console.log("got the keys boi: ", keys);
        AsyncStorage.multiGet(keys).then((values) => {
          console.log(
            "got them notes boi: ",
            values.map((note) => note[1])
          );
          setNotes(
            values.map((note) => {
              return { id: note[0], val: note[1] };
            })
          );
        });
      });
    } catch (e) {
      console.log("ERROR LOADING NOTE FROM LOCAL STORAGE");
      console.log(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#aaf",
      }}
    >
      <FlatList
        data={notes}
        style={{ width: "100%" }}
        renderItem={({ item: note }) => {
          console.log("OBJECT START\n", note, "\nOBJECT END\n\n");
          return (
            <TouchableHighlight
              style={styles.noteOuterContainer}
              onPress={() => navigation.navigate("Note", { note: note })}
            >
              <View style={styles.noteInnerContainer}>
                <Text style={styles.noteFont}>{note.val}</Text>
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
    backgroundColor: "#ccc",
    justifyContent: "center",
    borderBottomColor: "white",
    borderBottomWidth: 1,
  },
  noteFont: {
    marginLeft: 10,
    color: "black",
  },
});
