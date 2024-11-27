import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SavedRoutesProps {
  routes: { latitude: number; longitude: number }[][];
  onSelectRoute: (route: { latitude: number; longitude: number }[]) => void;
}

const SavedRoutes: React.FC<SavedRoutesProps> = ({ routes, onSelectRoute }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Saved Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.routeItem}
            onPress={() => onSelectRoute(item)}
          >
            <Text style={styles.routeText}>Route {index + 1}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  routeItem: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  routeText: {
    fontSize: 16,
  },
});

export default SavedRoutes;
