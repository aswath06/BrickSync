import React from 'react';
import { AdminTruckView } from './AdminTruckView';
import { DriverTruckView } from './DriverTruckView';

export const Truck = () => {
  const userRole = 2;
  const driverId = 'DR001';

  return userRole === 2 ? (
    <DriverTruckView driverId={driverId} />
  ) : (
    <AdminTruckView overrideTrucks={undefined} />
  );
};
