import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  Button,
} from "react-native";

import { getAllActors } from "../../constants/Constants";
import { styles } from "./MovieFilterScreen.styles";

const ALL_ACTORS = getAllActors();

// Input: navigation & route params, which we recieve through React Navigation
// Output: a Movie Filter Screen component, which displays a list of actors to filter on.
export default function MovieFilterScreen({ navigation, route }) {
  const [actors, setActors] = useState([]);

  // TODO: Destructure navigation params from props.

  useEffect(
    () => {
      // TODO: Recieve actors passed by MovieListScreen here, and update
      // our local state using setActors.
      setActors(route.params.actors)
    },
    [
      /* TODO: Insert dependent variables here. */
      route.params.actors
    ]
  );

  useEffect(
    () => {
      // TODO: Override the default back button to...
      //  1) Hide the left button.
      //  2) Show a "Done" button on the right that navigates back to the MovieListScreen
      //      and passes back our current list of actors via params.
      // https://reactnavigation.org/docs/header-buttons/
      navigation.setOptions({
        headerRight: () => (
          <Button
            title = "Done"
            onPress = {() => navigation.navigate('All Movies', {actors: actors})}
            />
        )

      })
    },
    [
      /* TODO: Insert dependent state variables here. */
      navigation, actors
    ]
  );

  // When we tap an actor cell, flip the boolean!
  const didTapActorCell = (actor) => {
    // We use the spread operator here to create a copy of the
    // actors array. This is typically how we deal with arrays in state,
    // since we can't directly change the value of the old array
    // (it won't re-render the screen, AND state is supposed
    // to be updated ONLY via the setter function!)
    let newActors = [...actors];
    if (actors.includes(actor)) {
      newActors.splice(newActors.indexOf(actor), 1);
    } else {
      newActors.push(actor);
    }
    setActors(newActors);
  };

  const renderSelectItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        key={index}
        onPress={() => didTapActorCell(item)}
      >
        <View style={styles.filtercell}>
          <Text style={{ fontFamily: "Avenir", fontSize: 15 }}>
            {actors.includes(item) ? "✓ " + item : " " + item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={{ fontFamily: "Avenir", fontSize: 22, margin: 20 }}>
          {"Filter by Actor"}
        </Text>
        <FlatList
          data={ALL_ACTORS}
          renderItem={renderSelectItem}
          keyExtractor={(item) => item}
        />
      </View>
    </SafeAreaView>
  );
}
