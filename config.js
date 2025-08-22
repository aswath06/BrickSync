// config.js
export const IP = '10.10.190.161';
export const PORT = 3000;
export const baseUrl = `http://10.10.70.82:3000`;
export const verifyUrl = baseUrl;

// Vehicles
export const GetVehiclesEndpoint = '/api/vehicles';
export const GetVehicleByIdEndpoint = id => `/api/vehicles/${id}`;
export const CreateVehicleEndpoint = '/api/vehicles';
export const UpdateVehicleEndpoint = id => `/api/vehicles/${id}`;
export const DeleteVehicleEndpoint = id => `/api/vehicles/${id}`;
export const AddServiceToVehicleEndpoint = id => `/api/vehicles/${id}/service`;
export const AddRefuelToVehicleEndpoint = id => `/api/vehicles/${id}/refuel`;
export const GetVehiclesByDriverIdEndpoint = id => `/api/vehicles/by-driver/${id}`;
export const GetUserByUserIdEndpoint = userid => `/api/users/by-userid/${userid}`;


// Users
export const SendOtpEndpoint = '/api/users/send-otp/email';
export const SendOtpWhatsappEndpoint = '/api/users/send-otp/whatsapp';
export const VerifyOtpEndpoint = '/api/users/verify-otp';
export const RegisterEndpoint = '/api/users';
