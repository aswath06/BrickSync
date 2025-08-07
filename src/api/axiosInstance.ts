// src/api/axiosInstance.js
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { baseUrl } from '../../config';

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      Toast.show({
        type: 'error',
        text1: 'Server Unreachable',
        text2: 'Please check your connection or try again later.',
      });
    }
    return Promise.reject(error);
  }
);

export default instance;
