import axios from 'axios';
import { useToast } from 'vue-toastification';

const baseURL = import.meta.env.VITE_API_BASE_URL;  // Ensure that this is set in your .env file

// Handle API responses (can customize these functions as needed)
const handleApiRes = (data, toast) => {
  toast.success(data.msg || 'Operation successful');
};

const handleApiErr = (error, toast) => {
  const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
  toast.error(errorMessage);
};

// User login API
export const userLoginApi = async (userData, router) => {
  const toast = useToast(); // Initialize toast
  try {
    const response = await axios.post(`${baseURL}/user/login`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { status, token } = response.data;

    if (status === 'success') {
      localStorage.setItem('authToken', token);
      router.push('/dashboard');
      return token;
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};

// User registration API
export const userRegisterApi = async (userData, router) => {
  const toast = useToast(); // Initialize toast
  try {
    const response = await axios.post(`${baseURL}/user/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });

    const { status, msg } = response.data;

    if (status === 'success') {
      toast.success(msg);
      router.push('/login');  // Redirect to login page after successful registration
      return true;
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};

// User update API
export const userUpdateApi = async (userData, router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    toast.error('Authorization token is missing');
    router.push('/login');
    return;
  }

  try {
    const response = await axios.post(`${baseURL}/user/update`, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, msg } = response.data;

    if (status === 'success') {
      toast.success(msg);
      return true;
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};

// Fetch user dashboard API
export const userDashboardApi = async (router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`${baseURL}/user/dashboard`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response.data;

    if (status === 'success' && data) {
      return data;
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};
