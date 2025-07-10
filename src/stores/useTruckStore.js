// store/useTruckStore.js
import { create } from 'zustand';

export const useTruckStore = create(() => ({
  trucks: [
    {
      number: 'TN39BL1288',
      details: {
        rcExpiry: '2025-08-12',
        insurance: '2026-01-20',
        permit: 'Yes',
        pollution: '2025-07-14',
        driver: 'Ramesh Kumar',
      },
    },
    {
      number: 'TN22CE4421',
      details: {
        rcExpiry: '2023-03-01',
        insurance: '2022-01-01',
        permit: 'No',
        pollution: '2025-07-12',
        driver: 'Suresh Singh',
      },
    },
    {
      number: 'TN11AB3344',
      details: {
        rcExpiry: '2025-07-11',
        insurance: '2025-12-01',
        permit: 'Yes',
        pollution: '2025-07-15',
        driver: 'Vikram Das',
      },
    },
    {
      number: 'TN45CD5566',
      details: {
        rcExpiry: '2024-06-20',
        insurance: '2024-07-09',
        permit: 'No',
        pollution: '2024-07-09',
        driver: 'Manoj Kannan',
      },
    },
    {
      number: 'TN67EF7788',
      details: {
        rcExpiry: '2026-05-01',
        insurance: '2026-06-30',
        permit: 'Yes',
        pollution: '2026-06-01',
        driver: 'Anbu Selvan',
      },
    },
    {
      number: 'TN33GH9900',
      details: {
        rcExpiry: '2022-12-31',
        insurance: '2023-01-15',
        permit: 'No',
        pollution: '2023-11-01',
        driver: 'Karthik Raja',
      },
    },
    {
      number: 'TN55IJ1122',
      details: {
        rcExpiry: '2025-09-01',
        insurance: '2025-10-20',
        permit: 'Yes',
        pollution: '2025-07-13',
        driver: 'Sathish R',
      },
    },
    {
      number: 'TN99KL3344',
      details: {
        rcExpiry: '2024-01-01',
        insurance: '2024-01-01',
        permit: 'Yes',
        pollution: '2025-01-01',
        driver: 'Prabhu Kumar',
      },
    },
  ],
}));
