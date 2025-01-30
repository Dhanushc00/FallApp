import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity  } from 'react-native';
import { Accelerometer, DeviceMotion } from 'expo-sensors';
import { useDispatch, useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import { useRouter, Link } from 'expo-router';
import { RootState } from '../store/store'; 
import { setAccelerometerData, setAngleData } from '../store/store';
import {setRouterRef} from '../Algorithm/routerRef';

interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp : number;
}

interface Angle {
  yaw: number;
  pitch: number;
  roll: number;
}

const HomeScreen: React.FC = () => {
  
  const router = useRouter();

  useEffect(() => {
    setRouterRef(router);
  }, [router]);

  useEffect(() => {
    const subscription = DeviceMotion.addListener(data => {
      const { rotation } = data;
      const toDegrees = (rad: number) => rad;
      dispatch(setAngleData({
        yaw: toDegrees(rotation?.alpha),
        pitch: toDegrees(rotation?.beta),
        roll: toDegrees(rotation?.gamma),
      }));
    });
  
    return () => subscription.remove();
  }, []);

  const dispatch = useDispatch();
  const isFall:boolean = useSelector((state: RootState) => state.isFall);
  const name:string = useSelector((state: RootState) => state.Emergency.name);
  const ph:string = useSelector((state: RootState) => state.Emergency.phoneno);
  const _subscribeAccelerometer = (): void => {
    Accelerometer.addListener((data: SensorData) => {
      dispatch(setAccelerometerData(data));
    });
  };

  const _unsubscribeAccelerometer = (): void => {
    Accelerometer.removeAllListeners();
  };

  useEffect(() => {
    _subscribeAccelerometer();
    return () => {
      _unsubscribeAccelerometer();
    };
  }, []);
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topRightButton} onPress={()=>router.push('/logs')}>
        <Text>⚙️</Text>
      </TouchableOpacity>
      <View
      style={styles.centerEmergency}
      >
        <LottieView
        source={require('../assets/images/HeartHome.json')}
        style={styles.centerImage}
        autoPlay
        loop
      />
<View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...styles.contactText, paddingBottom: 5}}> {(name == '' || ph == '') ? "No " : ""} Emergency Contact</Text>
          <Text style={{...styles.contactText, paddingBottom: 5}}>{name}</Text>
          <Text style={{...styles.contactText, paddingBottom: 10}}>{(name == '' || ph == '') ? "" : "+1 - " + ph}</Text>
      </View>
        </View>
      <View
        style={styles.centerImage}
      />
          <View style={styles.bottomButtonsContainer}>
      <Link href="/NameModal" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Enter Your Name</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/EmergencyContact" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Emergency Contact</Text>
        </TouchableOpacity>
      </Link>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topRightButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
  centerImage: {
    width: 350,
    height: 350,
    marginRight: 30
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  centerEmergency : {
    alignItems: 'center',
    justifyContent : 'space-around',
    flexDirection : 'column'
  },
  contactText : {
    color: '#333333',
    fontSize: 20,
    fontWeight: '400'
  }
});

export default HomeScreen;