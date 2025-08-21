import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  Platform,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {
  JobCard,
  MainCard,
  PendingJobsTable,
  UserHeaderCard,
} from '../Component';
import { DashboardInfoCard } from '../Component/DashboardInfoCard';
import { useUserStore } from '../stores/useUserStore';
import { useTruckStore } from '../stores/useTruckStore';
import { baseUrl } from '../../config';
import { moderateScale } from './utils/scalingUtils';

export const DashboardScreen = ({ navigation }) => {
  const user = useUserStore((state) => state.user);
  const userRole = user?.userrole;
  const [loadingOrderId, setLoadingOrderId] = useState(null);


  const [jobData, setJobData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTrucksByDriverId = useTruckStore((state) => state.fetchTrucksByDriverId);
  const trucks = useTruckStore((state) => state.trucks);

  useEffect(() => {
    if (userRole === 2 && user?.userid) {
      fetchTrucksByDriverId(user.userid);
    } else {
      fetchJobs();
    }
  }, []);

  useEffect(() => {
    if (userRole === 2 && trucks.length > 0) {
      const vehicleNumber = trucks[0]?.number;
      if (vehicleNumber) fetchJobsByVehicle(vehicleNumber);
    }
  }, [trucks]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/orders`);
      const data = await response.json();
      const transformed = transformJobData(data);
      setJobData(transformed);
    } catch (err) {
      console.error('❌ Failed to fetch jobs:', err);
    }
  };

  const fetchJobsByVehicle = async (vehicleNumber) => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/vehicle/${vehicleNumber}`);
      const data = await response.json();
      const transformed = transformJobData(data);
      setJobData(transformed);
    } catch (err) {
      console.error('❌ Failed to fetch jobs by vehicle:', err);
    }
  };

  const transformJobData = (data) => {
    return data
      .filter((item) => item.status.toLowerCase() !== 'delivered')
      .map((item, index) => ({
        id: item.id.toString(),
        orderId: item.orderId,
        slNo: (index + 1).toString(),
        customer: item.User?.name || 'Unknown',
        customerPhone: item.User?.phone || 'N/A',
        ord: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        vehicleNumber: item.vehicleNumber || item.Vehicle?.vehicleNumber || 'N/A',
        materials: Array.isArray(item.products)
          ? item.products.map((p) => ({
              name: p.name,
              quantity: p.quantity,
              price: p.price,
            }))
          : [],
      }));
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${baseUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error(`Failed to update status to ${status}`);

      if (userRole === 2 && trucks.length > 0) {
        await fetchJobsByVehicle(trucks[0]?.number);
      } else {
        await fetchJobs();
      }
    } catch (err) {
      console.error('❌ Error updating order status:', err);
    }
  };

  const uploadImage = async (file) => {
  const data = new FormData();
  data.append('file', {
    uri: file.uri,
    type: file.type,
    name: file.name,
  });
  data.append('upload_preset', 'bricksync');

  try {
    const res = await fetch('https://api.cloudinary.com/v1_1/dcr678fn4/image/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();

    if (!res.ok) {
      console.error('❌ Cloudinary Error:', result);
      return null;
    }

    console.log('✅ Uploaded Image URL:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Network Error uploading image:', error);
    return null;
  }
};


  const uploadDeliveryFile = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });

      const uploadedUrl = await uploadImage(res);
      if (uploadedUrl) {
        await markOrderAsDelivered(orderId, uploadedUrl);
        if (userRole === 2 && trucks.length > 0) {
          await fetchJobsByVehicle(trucks[0]?.number);
        } else {
          await fetchJobs();
        }
      }
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error selecting or uploading file:', error);
      }
    }finally{
      setLoadingOrderId(null);
    }
  };

  const markOrderAsDelivered = async (orderId, fileUrl) => {
    try {
      await fetch(`${baseUrl}/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: fileUrl }),
      });
    } catch (err) {
      console.error('❌ Failed to mark order as delivered:', err);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const refreshAction =
      userRole === 2 && trucks.length > 0
        ? fetchJobsByVehicle(trucks[0]?.number)
        : fetchJobs();
    Promise.resolve(refreshAction).finally(() => setRefreshing(false));
  }, [trucks]);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <UserHeaderCard
        name={user?.name || 'Guest'}
        imageUrl="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca"
        width={380}
        height={64}
      />

      {userRole === 2 ? (
        <>
          <View style={styles.section}>
            <MainCard
              name={user?.name || 'Guest'}
              company="Aswath Hollow Bricks and Lorry Services"
              balance={user?.balance}
              advance={user?.advance}
              driverId={user?.userid || 'null'}
              width={380}
              height={170}
            />
          </View>

          <View style={styles.section}>
            {jobData.length === 0 ? (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No data found</Text>
              </View>
            ) : (
              jobData.map((job, index) => (
                <View key={job.id} style={styles.section}>
                  <JobCard
                    slNo={(index + 1).toString().padStart(2, '0')}
                    customerName={job.customer}
                    customerPhone={job.customerPhone}
                    loadDetails={job.materials.map((mat) => `${mat.name} * ${mat.quantity}`)}
                    buttonLabel={
                      job.status === 'Delivered'
                        ? 'Delivered'
                        : job.status === 'Noted'
                        ? 'Mark as Delivered'
                        : 'Mark as Noted'
                    }
                    width={380}
                    disabled={loadingOrderId === job.orderId}
                    onPress={() => {
                      if (job.status === 'Noted') {
                        uploadDeliveryFile(job.orderId);
                      } else if (job.status !== 'Delivered') {
                        updateOrderStatus(job.orderId, 'noted');
                      }
                    }}
                  />
                </View>
              ))
            )}
          </View>
        </>
      ) : userRole === 3 ? (
        <View>
          <View style={styles.section}>
            <MainCard
              name={user?.name || 'Guest'}
              company="Aswath Hollow Bricks and Lorry Services"
              balance={user?.balance}
              advance={user?.advance}
              driverId={user?.userid || 'null'}
              width={380}
              height={170}
            />
          </View>
          <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No Pending Orders</Text>
        </View>
        </View>

      ) : (
        <>
          <View style={styles.cardRow}>
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png' }}
              title="All Jobs"
              value={23}
            />
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/190/190411.png' }}
              title="Completed Jobs"
              value={234}
            />
          </View>

          <View style={styles.cardRow1}>
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' }}
              title="All Users"
              value={12}
            />
            <DashboardInfoCard
              height={120}
              icon={{ uri: 'https://cdn-icons-png.flaticon.com/512/743/743007.png' }}
              title="Drivers"
              value={23}
            />
          </View>

          <View style={styles.tableContainer}>
            <PendingJobsTable title="Pending Jobs" jobs={jobData} navigation={navigation} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: moderateScale(42),
    paddingBottom: moderateScale(32),
    alignItems: 'center',
  },
  section: {
    marginTop: moderateScale(32),
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(16),
    marginTop: moderateScale(32),
    paddingHorizontal: moderateScale(16),
  },
  cardRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(16),
    paddingHorizontal: moderateScale(16),
    marginTop: moderateScale(16),
  },
  tableContainer: {
    width: moderateScale(450),
    paddingHorizontal: moderateScale(16),
  },
  noDataContainer: {
    marginTop: moderateScale(32),
    alignItems: 'center',
  },
  noDataText: {
    fontSize: moderateScale(16),
    color: '#999',
  },
});
