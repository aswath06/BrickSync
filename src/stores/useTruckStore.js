import { create } from 'zustand';
import axios from 'axios';
import {
  baseUrl,
  GetVehiclesByDriverIdEndpoint,
  GetVehiclesEndpoint,
} from '../../config';

export const useTruckStore = create((set) => ({
  trucks: [],

  fetchTrucksByDriverId: async (driverId) => {
    try {
      const response = await axios.get(`${baseUrl}${GetVehiclesByDriverIdEndpoint(driverId)}`);
      const trucks = response.data.map((truck) => ({
        id: truck.id,
        number: truck.vehicleNumber,
        details: {
          rcExpiry: truck.rcExpiry,
          pollution: truck.pollution,
          fitness: truck.fitness,
          tyreChangedDate: truck.tyreChangedDate,
          insurance: truck.insurance,
          permit: truck.permit,
          driver: truck.driverName,
          Driverid: truck.driverId,
        },
      }));
      set({ trucks });
    } catch (error) {
      console.error('❌ Error fetching trucks by driver ID:', error?.response?.data || error.message);
    }
  },

  fetchAllTrucks: async () => {
    try {
      const response = await axios.get(`${baseUrl}${GetVehiclesEndpoint}`);
      const trucks = response.data.map((truck) => ({
        id: truck.id,
        number: truck.vehicleNumber,
        details: {
          rcExpiry: truck.rcExpiry,
          pollution: truck.pollution,
          fitness: truck.fitness,
          tyreChangedDate: truck.tyreChangedDate,
          insurance: truck.insurance,
          permit: truck.permit,
          driver: truck.driverName,
          Driverid: truck.driverId,
          TotalKm: truck.totalKm,
        },
      }));
      set({ trucks });
    } catch (error) {
      console.error('❌ Error fetching all trucks:', error?.response?.data || error.message);
    }
  },
}));
