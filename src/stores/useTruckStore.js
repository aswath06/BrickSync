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
          TotalKm: truck.totalKm,
        },
        damageHistory: (truck.Services || []).map((service) => ({
          id: `S${service.id}`,
          text: service.title,
          date: service.date?.split('T')[0],
          status: service.status,
          file: { name: service.fileUrl?.split('/').pop() },
          changed: service.status === 'Need to Change',
        })),
        refuelHistory: (truck.Refuels || []).map((r) => ({
          id: `R${r.id}`,
          date: r.createdAt?.split('T')[0],
          amount: r.amount,
          volume: r.volume,
          kilometer: r.lastKm,
          mileage: r.mileage,
        })),
      }));
      set({ trucks });
    } catch (error) {
      console.error('❌ Error fetching trucks by driver ID:', error?.response?.data || error.message);
    }
  },

  // fetchAllTrucks: async () => {
  //   try {
  //     const response = await axios.get(`${baseUrl}${GetVehiclesEndpoint}`);
  //     const trucks = response.data.map((truck) => ({
  //       id: truck.id,
  //       number: truck.vehicleNumber,
  //       details: {
  //         rcExpiry: truck.rcExpiry,
  //         pollution: truck.pollution,
  //         fitness: truck.fitness,
  //         tyreChangedDate: truck.tyreChangedDate,
  //         insurance: truck.insurance,
  //         permit: truck.permit,
  //         driver: truck.driverName,
  //         Driverid: truck.driverId,
  //         TotalKm: truck.totalKm,
  //       },
  //       damageHistory: (truck.Services || []).map((service) => ({
  //         id: `S${service.id}`,
  //         text: service.title,
  //         date: service.date?.split('T')[0],
  //         status: service.status,
  //         file: { name: service.fileUrl?.split('/').pop() },
  //         changed: service.status === 'Need to Change',
  //       })),
  //       refuelHistory: (truck.Refuels || []).map((r) => ({
  //         id: `R${r.id}`,
  //         date: r.createdAt?.split('T')[0],
  //         amount: r.amount,
  //         volume: r.volume,
  //         kilometer: r.lastKm,
  //         mileage: r.mileage,
  //       })),
  //     }));
  //     set({ trucks });
  //   } catch (error) {
  //     console.error('❌ Error fetching all trucks:', error?.response?.data || error.message);
  //   }
  // }
fetchAllTrucks: async () => {
  try {
    const response = await axios.get(`${baseUrl}${GetVehiclesEndpoint}`);
    console.log('✅ Full vehicle response:', response.data);

    const trucks = response.data.map((truck) => ({
      id: truck.id,
      number: truck.number,
      driverId: truck.details?.Driverid || null,
      totalKm: truck.details?.TotalKm || 0,
      fitness: truck.details?.fitness,
      insurance: truck.details?.insurance,
      permit: truck.details?.permit,
      pollution: truck.details?.pollution,
      damageHistory: truck.damageHistory || [],
      refuelHistory: truck.refuelHistory || [],
    }));

    console.log('✅ Mapped trucks:', trucks);
    set({ trucks });
  } catch (error) {
    console.error('❌ Error fetching all trucks:', error?.response?.data || error.message);
  }
},

  addDamage: (vehicleNumber, damageEntry) => {
    set((state) => ({
      trucks: state.trucks.map((truck) =>
        truck.number === vehicleNumber
          ? {
              ...truck,
              damageHistory: [...(truck.damageHistory || []), damageEntry],
            }
          : truck
      ),
    }));
  },
  addRefuel: (vehicleNumber, refuelEntry) => {
    set((state) => ({
      trucks: state.trucks.map((truck) =>
        truck.number === vehicleNumber
          ? {
              ...truck,
              refuelHistory: [...(truck.refuelHistory || []), refuelEntry],
            }
          : truck
      ),
    }));
  },
}));
