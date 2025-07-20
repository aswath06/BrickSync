import { baseUrl, GetVehiclesEndpoint } from './constants';
import { useTruckStore } from './useTruckStore';

export const fetchTrucksFromBackend = async () => {
  try {
    const response = await fetch(`${baseUrl}${GetVehiclesEndpoint}`);
    const backendTrucks = await response.json();

    const transformedTrucks = backendTrucks.map((truck) => ({
      id: truck.slNo,
      number: truck.vehicleNumber,
      details: {
        insurance: truck.insurance?.split('T')[0],
        permit: truck.permit?.split('T')[0],
        pollution: truck.pollution?.split('T')[0],
        fitness: truck.fitness?.split('T')[0],
        driver: '', // Future: merge with driver info
        Driverid: truck.driverId,
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

    useTruckStore.getState().setTrucks(transformedTrucks);
  } catch (error) {
    console.error('❌ Failed to fetch trucks:', error);
  }
};
