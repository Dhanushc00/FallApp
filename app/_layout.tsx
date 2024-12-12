import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import  {Provider, useSelector} from 'react-redux';
import {createStore, AppStore} from '../store/store';
import { Text, View } from "react-native";

export default function RootLayout() {
  const [store, setStore] = useState<AppStore|null>(null);
  
  useEffect(()=> {
    const initStore = async() => {
      const newStore = await createStore();
      setStore(newStore);
    }
    initStore();
  }, []);
  if(!store) {
    return (<View></View>);
  }
  return (
    <Provider store={store}>
  <Stack>
    <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false 
        }} 
      />
     <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
     <Stack.Screen name="logs" options={{ headerShown: false }} />
     <Stack.Screen
        name="EmergencyContact"
        options={{
          presentation: 'modal',
          headerShown: false 
        }}
      />
      <Stack.Screen
        name="NameModal"
        options={{
          presentation: 'modal',
          headerShown: false 
        }}
      />
       <Stack.Screen
        name="Alert"
        options={{
          presentation: 'modal',
          headerShown: false 
        }}
      />
  </Stack>
  </Provider>
  );
}
