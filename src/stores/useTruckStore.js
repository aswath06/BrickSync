// store/useTruckStore.js
import { create } from 'zustand';

export const useTruckStore = create((set) => ({
  trucks: [
    {
      id: 'T001',
      number: 'TN39BL1288',
      details: {
        rcExpiry: '2025-08-12',
        insurance: '2026-01-20',
        permit: 'Yes',
        pollution: '2025-07-14',
        driver: 'Ramesh Kumar',
        Driverid: 'DR001',
      },
      damageHistory: [
        {
          id: 'D001',
          text: 'Left mirror broken',
          date: '2025-07-10',
          status: 'Can Drive',
          file: { name: 'mirror.jpg' },
          changed: false,
        },
        {
          id: 'D002',
          text: 'Front bumper dented',
          date: '2025-07-12',
          status: 'Need to Change',
          file: { name: 'bumper_damage.png' },
          changed: true, 
        },
      ],
    },
    {
      id: 'T002',
      number: 'TN22CE4421',
      details: {
        rcExpiry: '2023-03-01',
        insurance: '2022-01-01',
        permit: 'No',
        pollution: '2025-07-12',
        driver: 'Suresh Singh',
        Driverid: 'DR002',
      },
      damageHistory: [
        {
          id: 'D003',
          text: 'Rear lights not working',
          date: '2025-06-25',
          status: 'Normal',
          file: { name: 'rear_lights.pdf' },
        },
      ],
    },
    {
      id: 'T003',
      number: 'TN11AB3344',
      details: {
        rcExpiry: '2025-07-11',
        insurance: '2025-12-01',
        permit: 'Yes',
        pollution: '2025-07-15',
        driver: 'Vikram Das',
        Driverid: 'DR003',
      },
      damageHistory: [],
    },
  ],

  addDamage: (vehicleNumber, damage) =>
    set((state) => ({
      trucks: state.trucks.map((truck) =>
        truck.number === vehicleNumber
          ? {
              ...truck,
              damageHistory: [...(truck.damageHistory || []), damage],
            }
          : truck
      ),
    })),
}));
