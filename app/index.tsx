import React, { useState } from "react";
import {
  View,
  Modal,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import SavedRoutes from "./components/SavedRoutes";
import WeatherInfo from "./components/WeatherInfo";

// Define the MarkerData interface
interface MarkerData {
  coordinate: { latitude: number; longitude: number };
  title: string;
  description: string;
}

const Index: React.FC = () => {
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [newMarker, setNewMarker] = useState<Partial<MarkerData>>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showSavedRoutes, setShowSavedRoutes] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [routes, setRoutes] = useState<
    { latitude: number; longitude: number }[][]
  >([]);
  const [currentRoute, setCurrentRoute] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const handleLongPress = (event: any): void => {
    const coordinate = event.nativeEvent.coordinate;
    setNewMarker({ coordinate, title: "", description: "" });
    setModalVisible(true);
  };

  const saveMarker = (): void => {
    if (newMarker.coordinate && newMarker.title && newMarker.description) {
      setMarkers([...markers, newMarker as MarkerData]);
      setModalVisible(false);
    }
  };

  const handlePanDrag = (event: any): void => {
    const coordinate = event.nativeEvent.coordinate;
    setCurrentRoute((prevRoute) => [...prevRoute, coordinate]);
  };

  const saveRoute = (): void => {
    setRoutes([...routes, currentRoute]);
    setCurrentRoute([]);
  };

  const highlightRoute = (
    route: { latitude: number; longitude: number }[],
  ): void => {
    setCurrentRoute(route);
    setShowSavedRoutes(false);
  };

  const searchLocation = async (): Promise<void> => {
    if (!searchQuery) {
      Alert.alert("Error", "Please enter a location.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchQuery}&format=json&limit=1`,
      );
      const data = await response.json();
      if (data && data[0]) {
        const { lat, lon } = data[0];
        setRegion((prevRegion) => ({
          ...prevRegion,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        }));
        setSearchQuery(""); // Clear the search input after successful search
      } else {
        Alert.alert("Error", "Location not found.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          value={searchQuery}
          placeholder="Search for a location"
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={searchLocation}>
          <Text style={styles.searchButton}>Search</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
        onLongPress={handleLongPress}
        onPanDrag={handlePanDrag}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            coordinates={route}
            strokeColor="#000"
            strokeWidth={3}
          />
        ))}
        {currentRoute.length > 0 && (
          <Polyline
            coordinates={currentRoute}
            strokeColor="red"
            strokeWidth={2}
          />
        )}
      </MapView>

      <WeatherInfo region={region} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>New Marker</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            onChangeText={(text) =>
              setNewMarker((prev) => ({ ...prev, title: text }))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            onChangeText={(text) =>
              setNewMarker((prev) => ({ ...prev, description: text }))
            }
          />
          <Button title="Save Marker" onPress={saveMarker} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      {showSavedRoutes && (
        <Modal visible={showSavedRoutes} animationType="slide">
          <SavedRoutes routes={routes} onSelectRoute={highlightRoute} />
          <Button title="Close" onPress={() => setShowSavedRoutes(false)} />
        </Modal>
      )}

      <View style={styles.ViewSavedContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowSavedRoutes(true)}
        >
          <Text style={{ color: "white" }}> Saved Routes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={saveRoute}>
          <Text style={{ color: "white" }}>Save Route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    backgroundColor: "teal",
    padding: 12,
    borderCurve: "circular",
    borderRadius: "10%",
  },
  map: {
    flex: 1,
  },
  ViewSavedContainer: {
    position: "absolute",
    top: 50,
    alignSelf: "flex-end",
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  searchBarContainer: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBar: {
    flex: 1,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "teal",
    color: "white",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
});

export default Index;
