import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Image } from 'react-native';
import { ref, onValue, update } from "firebase/database";
import { rtdb } from './firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from "./firebaseConfig";
import { useNavigation } from '@react-navigation/native';

export default function Alert() {
  const [sensorData, setSensorData] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAlerts = () => {
      const sensorRef = ref(rtdb, 'pesos'); // Referencia a la colección 'pesos' en Realtime Database

      const unsubscribe = onValue(sensorRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredData = {};

          // Filtra los datos para mostrar solo los que tienen un peso mayor a 25 y status != 'approved'
          Object.entries(data).forEach(([key, value]) => {
            if (value.peso > 25 && value.status !== 'approved') {
              filteredData[key] = {
                peso: value.peso,
                fecha: value.fecha,
                status: value.status,
                id: value.id,
              };
            }
          });

          setSensorData(filteredData);
        } else {
          setSensorData({});
        }
      });

      return () => unsubscribe();
    };

    fetchAlerts(); // Llama a la función para obtener los datos en tiempo real

  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Sensor Data Monitoring</Text>
        <Image source={require('./assets/gatitoasomandose.png')} style={styles.catImage} />
      </View>

      <ScrollView style={styles.alertContainer}>
        {Object.keys(sensorData).length > 0 ? (
          Object.entries(sensorData).map(([key, data]) => (
            <View key={key} style={styles.alertBox}>
              <Text style={styles.alertText}>ID: {data.id}</Text>
              <Text style={styles.alertText}>Weight: {data.peso}</Text>
              <Text style={styles.alertText}>Date: {data.fecha}</Text>
              <Text style={styles.alertText}>status: {data.status}</Text>

              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => {
                  navigation.navigate("ReportTabs", {
                    screen: "Create Reports",
                    params: { reportData: { ...data, id: key } }, // Aquí key debe ser "dato01"
                  });
                }}
              >
                <Text style={styles.reportButtonText}>Report</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.alertText}>There are no alerts with a weight greater than 25 and not approved</Text>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    alignSelf: "center",
  },
  header: {
    backgroundColor: "#0066ff",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
  },
  catImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  alertContainer: {
    marginTop: 40,
    width: "100%",
  },
  alertBox: {
    backgroundColor: "#7D3C98",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  alertText: {
    color: "#fff",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#FF5733",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "90%",
    alignItems: 'center',
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  detailsBox: {
    backgroundColor: "#EAEDED",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: "90%",
    alignItems: "center",
  },
  detailsText: {
    color: "#333",
    fontSize: 16,
  },
  reportButton: {
    backgroundColor: "#28A745",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "90%",
    alignItems: 'center',
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
