import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface WeatherInfoProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number; // Describes the weather condition
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ region }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${region.latitude}&longitude=${region.longitude}&current_weather=true`,
        );
        const data = await response.json();

        if (data && data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
          });
        }
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
      }
    };

    fetchWeather();
  }, [region]);

  if (!weather) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Temperature: {weather.temperature}°C</Text>
      <Text style={styles.text}>Windspeed: {weather.windspeed} km/h</Text>
      <Text style={styles.text}>Weather Code: {weather.weathercode}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    fontSize: 16,
  },
});

export default WeatherInfo;
