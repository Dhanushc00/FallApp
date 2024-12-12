import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import {createStore, AppStore} from '../store/store';
import HomeScreen from "./HomeScreen";
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


const Index = () => {

  return (
    <SafeAreaProvider>
       <StatusBar style="auto" translucent={true} backgroundColor="black" />
    <SafeAreaView style={{ flex: 1 }}>
      <HomeScreen/>
    </SafeAreaView>
  </SafeAreaProvider>
    
  );
}

export default Index;