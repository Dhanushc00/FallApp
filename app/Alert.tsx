// ALert.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import {sendSms} from '../Algorithm/sendMessage';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { RootState, EmergencyContact, setAlertLogData } from '@/store/store';
import Moment from 'moment';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const Alert: React.FC = () => {
  const dispatch = useDispatch();
    const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const storeEmergencyData:EmergencyContact = useSelector((state: RootState) => state.Emergency);
  const storeName:string = useSelector((state: RootState) => state.userName);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          const time1 = Moment().format('MMMM Do YYYY, h:mm:ss a');
          dispatch(setAlertLogData({
            id: time1.toString(),
            timestamp : time1.toString(),
            status : 'alerted'
          }));
          const msg = `Hey ${storeEmergencyData.name} !, ${storeName} has saved you as his emergency contact, his phone activity indicates he has fallen down! Please check up on him`;
          sendSms(storeEmergencyData.phoneno, msg, router);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleDismiss = () => {
    console.log('Dismissed');
    const time1 = Moment().format('MMMM Do YYYY, h:mm:ss a');
          dispatch(setAlertLogData({
            id: time1.toString(),
            timestamp : time1.toString(),
            status : 'dismissed'
          }));
    setCountdown(1000);
    router.dismissAll();
    router.replace('/');
  };

  const handleAlert = () => {
    console.log('Alert sent');
    setCountdown(0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.countdownText}>
        Alert will be sent in {countdown} seconds
      </Text>
      <LottieView
        source={require('../assets/images/Alert.json')} // Update path to your lottie file
        style={styles.image}
        autoPlay
        loop
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.dismissButton]} onPress={handleDismiss}>
          <Text style={styles.buttonText}>Dismiss</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.alertButton]} onPress={handleAlert}>
          <Text style={styles.buttonText}>Alert!!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  countdownText: {
    paddingTop : 40,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: width * 0.35,
  },
  dismissButton: {
    backgroundColor: 'green',
  },
  alertButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Alert;