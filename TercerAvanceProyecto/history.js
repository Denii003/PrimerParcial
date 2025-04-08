import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, PermissionsAndroid, Platform, Image, SectionList } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";
import { FirebaseApp } from './firebaseConfig';
import { rtdb } from './firebaseConfig';
import { ref, onValue } from "firebase/database";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';


const HistoryScreen = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosRef = ref(rtdb, 'productos');

    const unsubscribe = onValue(productosRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allProductos = [];

        Object.entries(data).forEach(([qrKey, qrValue]) => {
          if (typeof qrValue === 'object' && !qrValue.Descripcion) {
            // Caso con subclave
            Object.entries(qrValue).forEach(([itemKey, itemValue]) => {
              allProductos.push({
                key: itemKey,
                qr: qrKey,
                descripcion: itemValue.Descripcion,
                id: itemValue.ID,
                peso: itemValue.Peso,
                fecha: itemValue.Fecha,
              });
            });
          } else {
            // Caso directo
            allProductos.push({
              key: qrKey,
              qr: qrKey,
              descripcion: qrValue.Descripcion,
              id: qrValue.ID,
              peso: qrValue.Peso,
              fecha: qrValue.Fecha,
            });
          }
        });

        setProductos(allProductos);
      } else {
        setProductos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {productos.length > 0 ? (
        <FlatList
          data={productos}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.reportItem}>
              <Text style={styles.titleH}>Code: {item.qr}</Text>
              <Text>Description: {item.descripcion}</Text>
              <Text>ID: {item.id}</Text>
              <Text>Weight: {item.peso}</Text>
              <Text>Date: {item.fecha}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noInspectionsText}>There are no products</Text>
      )}
    </View>
  );
};

const ReportScreen = () => {
  const [date, setDate] = useState("");
  const [reports, setReports] = useState([]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permiso de almacenamiento",
          message: "Se necesita acceso para guardar el archivo de reporte",
          buttonNeutral: "Preguntar después",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const fetchReportsByDate = async () => {
    const productosRef = ref(rtdb, 'productos');

    onValue(productosRef, (snapshot) => {
      if (!snapshot.exists()) {
        console.log("No hay datos");
        setReports([]);
        return;
      }

      const data = snapshot.val();
      const filtered = [];

      Object.entries(data).forEach(([qrKey, qrValue]) => {
        if (typeof qrValue === 'object' && !qrValue.Descripcion) {
          // Caso con subclave
          Object.entries(qrValue).forEach(([subKey, val]) => {
            if (val.Fecha?.startsWith(date)) {
              filtered.push({
                qr: qrKey,
                subKey,
                descripcion: val.Descripcion,
                fecha: val.Fecha,
                id: val.ID,
                peso: val.Peso,
              });
            }
          });
        } else {
          // Caso directo
          if (qrValue.Fecha?.startsWith(date)) {
            filtered.push({
              qr: qrKey,
              subKey: qrKey,
              descripcion: qrValue.Descripcion,
              fecha: qrValue.Fecha,
              id: qrValue.ID,
              peso: qrValue.Peso,
            });
          }
        }
      });

      setReports(filtered);
    });
  };

  // Web
  const downloadTextFileWeb = (filename, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
  };

  const generateTextFile = async () => {
    if (reports.length === 0) {
      console.log("No hay datos para generar archivo");
      return;
    }

    const textContent = `Reporte de Inspección - ${date}\n\n` +
      reports.map(
        (item) =>
          `QR: ${item.qr}\nClave: ${item.subKey}\nDescripción: ${item.descripcion}\nID: ${item.id}\nPeso: ${item.peso}\nFecha: ${item.fecha}\n`
      ).join('\n');

    const fileName = `Reporte_Inspección_${date}.txt`;

    if (Platform.OS === 'web') {
      downloadTextFileWeb(fileName, textContent);
    } else {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      try {
        await FileSystem.writeAsStringAsync(fileUri, textContent, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        console.log("Archivo guardado en:", fileUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          alert("Archivo guardado en: " + fileUri);
        }
      } catch (error) {
        console.error("Error al guardar archivo:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Date (dd/mm/yyyy)"
        value={date}
        onChangeText={setDate}
      />
      <TouchableOpacity style={styles.button} onPress={fetchReportsByDate}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={generateTextFile}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.subKey}
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text>QR: {item.qr}</Text>
            <Text>Description: {item.descripcion}</Text>
            <Text>ID: {item.id}</Text>
            <Text>Weight: {item.peso}</Text>
            <Text>Date: {item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

const HistoryTabs = () => {
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
      tabBarStyle: { backgroundColor: "#5c2ac2" },
      tabBarIndicatorStyle: { backgroundColor: "white", height: 3 },
    }}>
       
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Daily History" component={ReportScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  return(
  <View style={styles.container}>
       <View style={styles.header}>
         <Text style={styles.headerText}>Welcome to the History!</Text>
         <Image source={require('./assets/michihistory.png')} style={styles.catImage} />
       </View>
       <HistoryTabs />
     </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0066ff",
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  catImage: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
  title: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  titleH: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reportItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    width: "100%", 
    elevation: 3, // Agrega sombra en Android
    shadowColor: "#000", // Sombra en iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  noInspectionsText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
