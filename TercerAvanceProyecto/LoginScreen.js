import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler, Platform, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; 
import { db } from "./firebaseConfig"; 
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width } = Dimensions.get("window"); // Get screen dimensions

const LoginScreen = () => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [inspectorName, setInspectorName] = useState(""); 
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigation = useNavigation(); 

  // Disable back button
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Warning", "You cannot go back from the login screen.");
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        Alert.alert("Error", "Please enter username and password.");
        return;
      }
  
      const employeeRef = collection(db, "Employee");
      const q = query(employeeRef, where("name", "==", username));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const employeeData = querySnapshot.docs[0].data();
  
        if (employeeData.password === password) {
          Alert.alert("Success", "Welcome!");
  
          // Establece el nombre del inspector al hacer login
          setInspectorName(employeeData.name);
  
          // Guardar el nombre del inspector en AsyncStorage
          await AsyncStorage.setItem('inspectorName', employeeData.name);
          console.log('Inspector name saved:', employeeData.name); // Verifica que se guarda correctamente
  
          navigation.replace("Home");
        } else {
          Alert.alert("Error", "Incorrect Password.");
        }
      } else {
        Alert.alert("Error", "User not found.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "An issue occurred while logging in.");
    }
  };

  return (
    <View style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      paddingHorizontal: Platform.OS === "web" ? 40 : 24, // More padding on web
      width: "100%",
    }}>
      {/* Header with Welcome */}
      <View style={{
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 32,
      }}>
        <View style={{
          backgroundColor: "#3B82F6",
          padding: 16,
          borderTopLeftRadius: 30,
          borderBottomRightRadius: 80,
        }}>
          <Text style={{
            fontSize: width < 768 ? 24 : 28, // Adjust for larger screens
            fontWeight: "bold",
            color: "white",
          }}>
            Welcome!
          </Text>
        </View>
      </View>

      {/* Username Field */}
      <Text style={{
        alignSelf: "flex-start",
        fontSize: width < 768 ? 14 : 16,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 8,
      }}>
        Username
      </Text>
      <View style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
      }}>
        <TextInput 
          placeholder="Enter your username"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={(text) => setUsername(text)} 
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
          }}
        />
      </View>

      {/* Password Field */}
      <Text style={{
        alignSelf: "flex-start",
        fontSize: width < 768 ? 14 : 16,
        fontWeight: "600",
        color: "#64748B",
        marginBottom: 8,
      }}>
        Password
      </Text>
      <View style={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#CBD5E1",
        borderRadius: 10,
        paddingHorizontal: 12,
        marginBottom: 16,
      }}>
        <TextInput 
          placeholder="******"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={(text) => setPassword(text)} 
          style={{
            flex: 1,
            paddingVertical: 12,
            fontSize: 16,
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin} 
        style={{
          width: "100%",
          backgroundColor: "#1E40AF",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{
          color: "white",
          fontWeight: "bold",
          fontSize: width < 768 ? 16 : 18, // Adjust for larger screens
        }}>
          Login
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
