import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, Button, Alert, TextInput, ScrollView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { collection, onSnapshot, addDoc, query, orderBy, getDocs, doc, runTransaction,} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { ref, update } from 'firebase/database';
import { rtdb } from './firebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ViewReportScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función segura para formatear fechas
  const formatDate = (dateValue) => {
    if (!dateValue) return "Undated";

    if (dateValue.toDate) return dateValue.toDate().toLocaleString();

    const date = new Date(dateValue);
    return !isNaN(date.getTime()) ? date.toLocaleString() : "Invalid date";
  };

  useEffect(() => {
    const reportsCollection = collection(db, "Report");

    // Agregamos orden por report_id ascendente
    const q = query(reportsCollection, orderBy("report_id", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reportsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color="#5c2ac2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text style={styles.title}>Report ID: {item.report_id}</Text>
            <Text>Inspector: {item.inspector_name}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Status: {item.status}</Text>
            <Text>Date: {formatDate(item.report_date)}</Text>
          </View>
        )}
      />
    </View>
  );
};
const ReportScreen = ({ route, navigation }) => {
  const { reportData } = route.params || {};

  if (!reportData) {
    return <Text style={styles.titleH} >No report data received</Text>;
  }

  const [description, setDescription] = useState(reportData.description || "");
  const [status, setStatus] = useState(reportData.status || "");
  const [inspectionType, setInspectionType] = useState("");
  const [comments, setComments] = useState("");
  const [inspectorName, setInspectorName] = useState("");

  useEffect(() => {
    const getInspectorName = async () => {
      try {
        const storedInspectorName = await AsyncStorage.getItem("inspectorName");
        if (storedInspectorName) {
          setInspectorName(storedInspectorName);
        } else {
          setInspectorName("Not authenticated");
        }
      } catch (error) {
        console.error("Error retrieving inspector name:", error);
        setInspectorName("Error loading name");
      }
    };

    getInspectorName();
  }, []);

  const generateReportId = async () => {
    const counterRef = doc(db, "Counters", "ReportId");

    const newReportId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists()) {
        const initialId = 10;
        const nextId = initialId + 1;
        transaction.set(counterRef, { lastId: nextId });
        return nextId;
      }

      const lastId = counterDoc.data().lastId || 0;
      const nextId = lastId + 1;
      transaction.update(counterRef, { lastId: nextId });

      return nextId;
    });

    return newReportId;
  };

  const handleCreateReport = async () => {
    if (!description.trim() || !inspectionType.trim() || !status.trim()) {
      Alert.alert("Error", "Required fields cannot be empty");
      return;
    }

    try {
      const newReportId = await generateReportId();
      const now = new Date();

      // 1. Save the report to Firestore
      await addDoc(collection(db, "Report"), {
        description,
        status,
        report_date: now,
        comments,
        inspection_type: inspectionType,
        inspector_name: inspectorName,
        report_id: newReportId,
        timestamp: now,
      });

      // 2. Only update Realtime Database if the status is "approved"
      if (status.toLowerCase() === "approved" && reportData.id) {
        const sensorRef = ref(rtdb, `pesos/${reportData.id}`);
        await update(sensorRef, {
          status: "approved",
        });
      }

      Alert.alert("Success", "Report created successfully");

      navigation.navigate("ViewReportScreen");

      setDescription("");
      setStatus("");
      setInspectionType("");
      setComments("");
    } catch (error) {
      console.error("Error creating report:", error);
      Alert.alert("Error", "Could not create the report");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Report</Text>

      <TextInput
        style={styles.input}
        placeholder="Inspection Type"
        value={inspectionType}
        onChangeText={setInspectionType}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Status"
        value={status}
        onChangeText={setStatus}
      />

      <TextInput
        style={styles.input}
        placeholder="Comments"
        value={comments}
        onChangeText={setComments}
      />

      <Button title="Create Report" onPress={handleCreateReport} />
    </View>
  );
};
const Tab = createMaterialTopTabNavigator();

const ReportTabs = () => {
  return (
    <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: "#5c2ac2" },
          tabBarIndicatorStyle: { backgroundColor: "white", height: 3 },
        }}
    >
      <Tab.Screen name="Reports" component={ViewReportScreen} />
      <Tab.Screen name="Create Reports" component={ReportScreen} />
    </Tab.Navigator>
  );
};

export default function ReportScreenTabs() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to the Reports!</Text>
        <Image source={require('./assets/michireport.png')} style={styles.catImage} />
      </View>
      <ReportTabs />
    </View>
  );
}

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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  titleH: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  listItem: {
    height: 80,
    backgroundColor: "#0033cc",
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  listContainer: {
    padding: 20,
  },
  scrollView: {
    paddingBottom: 20,
    width: "100%",
  },
});
