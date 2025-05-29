//create a zustand store for a token of a user
import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { v4 as uuidv4 } from 'uuid';

export interface AlertMessage {
  // id is requried, but set by the store
  id?: string; // UUID for unique identification
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number; // in milliseconds
}
interface InterfaceState {
  alerts: AlertMessage[];
  addAlert: (alert: AlertMessage) => void;
  removeAlert: (id: string) => void;
}

export const useInterfaceStore = create<InterfaceState>(
  (set: any, get: any) => ({
    alerts: [],
    addAlert: (alert: AlertMessage) => {
      const id = uuidv4();
      set((state: InterfaceState) => ({
        alerts: [...state.alerts, { ...alert, id }],
      }));
    },
    removeAlert: (id: string) => {
      set((state: InterfaceState) => ({
        alerts: state.alerts.filter((alert) => alert.id !== id),
      }));
    },
  })
);

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useInterfaceStore);
}
