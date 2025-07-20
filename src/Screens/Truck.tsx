import React from 'react';
import { AdminTruckView } from './AdminTruckView';
import { DriverTruckView } from './DriverTruckView';
import { useUserStore } from '../stores/useUserStore';

export const Truck = () => {
  const user = useUserStore((state) => state.user);
  const userRole = user?.userrole;
  const driverId = user?.userid;

  return userRole === 2 ? (
    <DriverTruckView driverId={driverId} />
  ) : (
    <AdminTruckView overrideTrucks={undefined} />
  );
};
