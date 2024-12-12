// routerRef.ts
import { Router } from 'expo-router';

let routerRef: Router | null = null;

export const setRouterRef = (ref: Router) => {
  routerRef = ref;
};

export const getRouterRef = () => routerRef;