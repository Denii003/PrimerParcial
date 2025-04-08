import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen'; // Ajusta la ruta de LoginScreen
import alert from './alert';
import Inspection from './inspection';
import ReportTabs from './report'; // Ajusta la ruta de ReportTabs
import AppNavigator from './home'; // Importa AppNavigator (Drawer Navigator)

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />

        <Stack.Screen
          name="Home"
          component={AppNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Alert"
          component={alert}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Inspection"
          component={Inspection}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportTabs"
          component={ReportTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
