import React, { useState, useEffect } from "react";
import { Platform, View, Image } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";
import { getApp, initializeApp } from "firebase/app";
import { addDoc, collection, doc, getFirestore, setDoc } from "firebase/firestore";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
import DateTimePickerModal from "react-native-modal-datetime-picker";

// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";

import firebase from "firebase/app";
import "firebase/firestore";
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.
    
    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */
  const [name, setName] = React.useState<string>('')
  const [loc, setLoc] = React.useState<string>('')
  const [desc, setDesc] = React.useState<string>('')
  const [date, setDate] = React.useState('')
  const [image, setImage] = React.useState<string>('')
  const [visible, setVisible] = React.useState(false)
  
  
  

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/
  
    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      console.log(result);
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    
  
     }

  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      console.warn("A date has been picked: ", date);
      hideDatePicker();
      setDate(date)
    };
  
   
   

  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html
  const onToggleSnackBar = () => setVisible(!visible)
  const onDismissSnackBar = () => setVisible(false);

  
  const asyncAwaitNetworkRequests = async () => {
    console.log("Beginning")
    const object = await getFileObjectAsync(image);
    const db = getFirestore();
    const storage = getStorage(getApp());
    const storageRef = ref(storage, uuid() + ".jpg");
    const result = await uploadBytes(storageRef, object as Blob);
    const downloadURL = await getDownloadURL(result.ref);
    console.log("Collected Data")
    const socialDoc: SocialModel = {
      eventName: name,
      eventDate: date,
      eventLocation: loc,
      eventDescription: desc,
      eventImage: downloadURL,
    };
    //await setDoc(doc(db, "socials", ), socialDoc);
    const docRef = await addDoc(collection(db, "socials"), socialDoc);
    console.log("Finished social creation.");
  };

  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.

    // Otherwise, proceed onwards with uploading the image, and then the object.

    try {
      asyncAwaitNetworkRequests()
      // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
      // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!

      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.

      // (1) Write the image to Firebase Cloud Storage. Make sure to do this
      // using an "await" keyword, since we're in an async function. Name it using
      // the uuid provided below.

      // (2) Get the download URL of the file we just wrote. We're going to put that
      // download URL into Firestore (where our data itself is stored). Make sure to
      // do this using an async keyword.

      // (3) Construct & write the social model to the "socials" collection in Firestore.
      // The eventImage should be the downloadURL that we got from (3).
      // Make sure to do this using an async keyword.
      
      // (4) If nothing threw an error, then go back to the previous screen.
      //     Otherwise, show an error.

    } catch (e) {
      console.log("Error while writing social:", e);
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
        {/* TextInput */
        <TextInput
          label="Event Name"
          value={name}
          onChangeText={name => setName(name)}
          autoComplete = "off"
        />}
        {/* TextInput */
        <TextInput
          label="Event Location"
          value={loc}
          onChangeText={loc => setLoc(loc)}
          autoComplete = "off"
        />}
        {/* TextInput */
        <TextInput
          label="Event Description"
          value={desc} 
          onChangeText={desc => setDesc(desc)}
          autoComplete = "off"
        />}
        {/* Button */
        <Button onPress={showDatePicker}>CHOOSE A DATE</Button>}
        {/* Button */
        <Button onPress={pickImage}>PICK AN IMAGE</Button>
        }
        {/* Button */
        <Button onPress={saveEvent}>SAVE EVENT</Button>
        }
        {/* DateTimePickerModal */
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
        }
        {/* Snackbar */
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}>
        Wrong Wrong Wrong!
      </Snackbar>
        }
      </View>
    </>
  );
}
