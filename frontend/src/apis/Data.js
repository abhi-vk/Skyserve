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

// Save drawn data API
export const saveDrawnDataApi = async (drawnData, router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    toast.error('Authorization token is missing');
    router.push('/login');
    return;
  }

  try {
    const response = await axios.post(
      `${baseURL}/save`,
      { data: drawnData }, // You may need to adjust the payload structure as per your backend
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

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

// Fetch all saved data API for user
export const getAllSavedDataApi = async (router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`${baseURL}/all`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response.data;

    if (status === 'success' && data) {
      return data; // Return array of saved data objects
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};

// Fetch single saved data by ID API
export const getSavedDataByIdApi = async (id, router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    router.push('/login');
    return;
  }

  try {
    const response = await axios.get(`${baseURL}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const { status, data } = response.data;

    if (status === 'success' && data) {
      return data; // Return single saved data object by ID
    } else {
      handleApiRes(response.data, toast);
    }
  } catch (error) {
    handleApiErr(error, toast);
  }
};

// Delete saved data by ID API
export const deleteSavedDataApi = async (id, router) => {
  const toast = useToast(); // Initialize toast
  const token = localStorage.getItem('authToken');

  if (!token) {
    toast.error('Authorization token is missing');
    router.push('/login');
    return;
  }

  try {
    const response = await axios.delete(`${baseURL}/${id}`, {
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
