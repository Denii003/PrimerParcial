import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, Button, View, TextInput, Image } from 'react-native';

export default function App() {

  // Variables de estado
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    // setId('');
    // setEmail('');
    // setName('');
    // setPhone('');
  };

  return (
    <View style={styles.container}>
      <Image source={require("./assets/NFLGamePass.png")} style={styles.image} />

      <TextInput 
        style={styles.input}
        placeholder='ID'
        keyboardType='numeric'
        value={id}
        onChangeText={setId}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder='Name'
        value={name}
        onChangeText={setName}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder='Email'
        keyboardType='email-address'
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#666"
      />

      <TextInput
        style={styles.input}
        placeholder='Phone'
        keyboardType='phone-pad'
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#666"
      />

      <Button title='Log in' onPress={handleSubmit} />

      {submitted && (
        <View style={styles.output}>
          <Text>ID: {id}</Text>
          <Text>Nombre: {name}</Text>
          <Text>Email: {email}</Text>
          <Text>Phone: {phone}</Text>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#283593',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  input: {
    width: "80%",
    padding: 12,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "#3F51B5",
    borderRadius: 5,
    backgroundColor: "#FFFFFF",  // Color de fondo blanco
    color: "#000000", // Texto en negro
  },

  output: {
    marginTop: 20,
    alignItems: "center",
  },

  image: {
    width: '90%',  //  ancho
    height: '40%', //  altura
    marginBottom: 20,
  },
});
