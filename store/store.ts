import { combineReducers, configureStore, createSlice, PayloadAction, Store, Middleware } from '@reduxjs/toolkit';
import { Audio } from 'expo-av';
import {detectFall} from '../Algorithm/detection';
import {getRouterRef} from '../Algorithm/routerRef';

export interface SensorData {
  x: number;
  y: number;
  z: number;
  timestamp : number;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  status: 'dismissed' | 'alerted';
}

export interface Angle {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface EmergencyContact {
  name : string;
  phoneno : string;
}

interface RootStateValue {
  accelerometerData: SensorData[];
  angleData: Angle[];
  isFall : boolean;
  userName : string;
  Emergency : EmergencyContact;
  AlertLogs : AlertItem[];
}

const MAX_RECORDS = 25; // 2.5 seconds
const defaultSensor : SensorData = { x: 0, y: 0, z: 0, timestamp: 0 };
const defaultAngle : Angle = { yaw: 0, pitch: 0, roll: 0};

const initialState: RootStateValue = {
  accelerometerData: Array.from({ length: MAX_RECORDS }, () => ({ ...defaultSensor })), // 25 records ~ 10 Hz
  angleData: Array.from({ length: MAX_RECORDS }, () => ({ ...defaultAngle })), // 150 records ~ 60 Hz
  isFall : false,
  userName : '',
  Emergency : {
    name : '',
    phoneno : ''
  },
  AlertLogs : []
};

const accelerometerSlice = createSlice({
  name: 'accelerometer',
  initialState: initialState.accelerometerData,
  reducers: {
    setAccelerometerData: (state, action: PayloadAction<SensorData>) => {
      if (state.length >= MAX_RECORDS) {
        state.shift();
      }
      state.push(action.payload);
    },
  },
});

const flagSlice = createSlice({
  name: 'flag',
  initialState: initialState.isFall,
  reducers: {
    setFlagData: (state, action: PayloadAction<boolean>) => {
      return action.payload
    },
  },
});

const angleSlice = createSlice({
  name: 'angle',
  initialState: initialState.angleData,
  reducers: {
    setAngleData: (state, action: PayloadAction<Angle>) => {
      if (state.length >= 150) {
        state.shift();
      }
      state.push(action.payload);
    },
  },
});

const userNameSlice = createSlice({
  name: 'userName',
  initialState: initialState.userName,
  reducers: {
    setUserNameData: (state, action: PayloadAction<string>) => {
      return action.payload
    },
  },
});

const emergencySlice = createSlice({
  name: 'emergency',
  initialState: initialState.Emergency,
  reducers: {
    setEmergencyData: (state, action: PayloadAction<EmergencyContact>) => {
      return action.payload
    },
  },
});

const alertLogSlice = createSlice({
  name : 'alertLogs',
  initialState : initialState.AlertLogs,
  reducers : {
    setAlertLogData : (state, action : PayloadAction<AlertItem>) => {
      state.push(action.payload);
    },
    clearAlertLogData : () => {
      return [];
    }
  }
})



const rootReducer = combineReducers({
  accelerometerData: accelerometerSlice.reducer,
  angleData: angleSlice.reducer,
  isFall : flagSlice.reducer,
  userName : userNameSlice.reducer,
  Emergency : emergencySlice.reducer,
  AlertLogs: alertLogSlice.reducer
})


function averageSixAngles(angles: Angle[]): Angle[] {
  const averagedAngles: Angle[] = [];
  for (let i = 0; i < angles.length; i += 6) {
    const sixAngles = angles.slice(i, i + 6);
    const averageYaw = sixAngles.reduce((sum, angle) => sum + angle.yaw, 0) / 6;
    const averagePitch = sixAngles.reduce((sum, angle) => sum + angle.pitch, 0) / 6;
    const averageRoll = sixAngles.reduce((sum, angle) => sum + angle.roll, 0) / 6;
    averagedAngles.push({ yaw: averageYaw, pitch: averagePitch, roll: averageRoll });
  }
  return averagedAngles;
}

const alertMiddleware: Middleware<{}, RootState> = store => next => async action => {
  const result = next(action);
  
  const state = store.getState();
  const acc = state.accelerometerData[24];
  if (acc) {
    const { x, y, z } = acc;
    const svm_val = Math.sqrt(x * x + y * y + z * z);
    if (svm_val > 3.5 && detectFall(state.accelerometerData, averageSixAngles(state.angleData))) {
      await triggerFunction();
      setFlagData(true);
      const router = getRouterRef();
      if (router) {
        router.push('/Alert');
      }
    }
  }
  
  return result;
};

const triggerFunction = async () => {
  try {
    setFlagData(true);
    const soundObject = new Audio.Sound();
    await soundObject.loadAsync(require('../assets/beep.mp3'));
    await soundObject.playAsync();
  } catch (error) {
    console.error('Error in triggerFunction:', error);
  }
};


const configureAppStore = (): AppStore => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(alertMiddleware),
  });
};

export const createStore = async () => {
  return await configureAppStore();
}

export type AppStore = Store<RootStateValue>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];

export const {setAccelerometerData} = accelerometerSlice.actions;
export const {setAngleData} = angleSlice.actions;
export const {setFlagData} = flagSlice.actions;
export const {setUserNameData} = userNameSlice.actions;
export const {setEmergencyData} = emergencySlice.actions;
export const {clearAlertLogData, setAlertLogData} = alertLogSlice.actions;