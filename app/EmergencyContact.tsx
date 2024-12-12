// app/emergency-modal.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import {EmergencyContact, RootState, setEmergencyData } from '../store/store';

const EmergencyContactModal=()=> {
    const dispatch = useDispatch();
  const storeEmergencyData:EmergencyContact = useSelector((state: RootState) => state.Emergency);
  const [emergencyContact, setEmergencyContact] = useState({ name: '', phone: '' });
  const router = useRouter();

  const handleSubmit = () => {
    dispatch(setEmergencyData({
        name : emergencyContact.name,
        phoneno: emergencyContact.phone
    }))
    // Handle emergency contact submission logic here
    console.log('Emergency contact submitted:', emergencyContact);
    router.back();
  };
  React.useEffect(()=> {
    setEmergencyContact({
        name: storeEmergencyData.name,
        phone : storeEmergencyData.phoneno
    })
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Emergency contact name"
        value={emergencyContact.name}
        onChangeText={(text) => setEmergencyContact({ ...emergencyContact, name: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency contact phone"
        value={emergencyContact.phone}
        onChangeText={(text) => setEmergencyContact({ ...emergencyContact, phone: text })}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

export default EmergencyContactModal;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});