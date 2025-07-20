export const IP = '10.10.66.33';
//  http://172.20.10.3:3000
export const PORT = 3000;
export const baseUrl = `http://${IP}:${PORT}`;
export const verifyUrl = baseUrl;

export const SendOtpEndpoint = '/api/users/send-otp';
export const SendOtpWhatsappEndpoint = '/api/users/send-otp/whatsapp'; // ✅ WhatsApp OTP
export const VerifyOtpEndpoint = '/api/users/verify-otp';
export const RegisterEndpoint = '/api/users';
// http://10.10.66.33:3000