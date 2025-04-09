import axios from "axios";

const adminAxiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/admin`,
  headers: {
    'Accept-Language': 'es' // Añadimos esta línea
  }
});

adminAxiosClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('ADMIN_TOKEN')}`;
  return config;
});

adminAxiosClient.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('ADMIN_TOKEN');
    /* window.location.reload(); */
    // router.navigate('/admin/login');
    return error;
  }
  throw error;
});

export default adminAxiosClient;