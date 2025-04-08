import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import alert from './alert';
import history from './history';
import report from './report';
import { useNavigation } from '@react-navigation/native'; // Importamos el hook useNavigation

const Drawer = createDrawerNavigator();

// 📌 Menú lateral personalizado
const CustomDrawerContent = (props) => {
  const navigation = useNavigation(); // Usamos el hook para obtener la navegación
  
  const handleSignOut = () => {
    // Aquí es donde se implementa el log out y el redireccionamiento
    console.log("Signing out...");
    // Reseteamos la pila de navegación y redirigimos al login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }], // 'Login' es el nombre de tu pantalla de inicio de sesión
    });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.profileContainer}>
        <Image source={require('./assets/fondoNano.jpg')} style={styles.profileImage} />
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity onPress={() => props.navigation.navigate("Alert")} style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="blue" />
          <Text style={styles.menuText}>Alert</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("History")} style={styles.menuItem}>
          <Ionicons name="document-text-outline" size={24} color="blue" />
          <Text style={styles.menuText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate("Report")} style={styles.menuItem}>
          <Ionicons name="create-outline" size={24} color="blue" />
          <Text style={styles.menuText}>Report</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
        <Ionicons name="exit-outline" size={24} color="black" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// 📌 Configuración del Drawer Navigator
const AppNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation })  => ({
        headerShown: true,
        headerTitle: "", // Oculta el título en la barra
        headerStyle: { backgroundColor: "#0066ff", elevation: 0, shadowOpacity: 0, height: 70},
        headerRight: () => null, // Elimina el icono de la derecha
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginRight:30 }}>
            <Ionicons name="menu" size={40} color="0066ff" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen name="Alert" component={alert} />
      <Drawer.Screen name="History" component={history} />
      <Drawer.Screen name="Report" component={report} />
    </Drawer.Navigator>
  );
};

// 📌 Envolvemos en NavigationContainer
const App = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

// 📌 Estilos
const styles = StyleSheet.create({
  profileContainer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#E5E7EB",
  },
  profileImage: {
    width: 330,
    height: 270,
    borderRadius: 5,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
  },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  signOutText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

// ✅ Exportamos el componente principal
export default AppNavigator;
