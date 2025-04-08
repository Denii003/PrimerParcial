import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function Inspection() {
  const route = useRoute();
  const sensorData = route.params?.sensorData || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sensor Inspection</Text>
      </View>
      <ScrollView style={styles.sensorContainer}>
        {Object.keys(sensorData).length > 0 ? (
          Object.entries(sensorData).map(([key, values]) => (
            <View key={key} style={styles.sensorBox}>
              <Text style={styles.sensorTitle}>{key}:</Text>
              {values.map((val, index) => (
                <Text key={index} style={styles.sensorText}>- {val}</Text>
              ))}
            </View>
          ))
        ) : (
          <Text style={styles.sensorText}>No sensor data available</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#007BFF",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  sensorContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sensorBox: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  sensorText: {
    color: "#fff",
    fontSize: 16,
  },
});
