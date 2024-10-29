import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your actual API URL
});

// Interceptor to add JWT to headers
api.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// Authentication
export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response;
};

// Register a new user
export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response;
};

// Logout user (just clear the JWT on the client-side)
export const logout = () => {
  localStorage.removeItem('jwt'); // Clear JWT from local storage
};

// Fetch Exams
export const fetchExams = () => {
  return api.get('/exams');
};

// Add an Exam
export const addExam = (data) => {
  return api.post('/exams/add', data);
};

// Edit an Exam
export const editExam = (id, data) => {
  return api.put(`/exams/edit/${id}`, data);
};

// Delete an Exam
export const deleteExam = (id) => {
  return api.delete(`/exams/delete/${id}`);
};

// Fetch Room Names
export const fetchRoomNames = () => {
  return api.get('/rooms/names');
};

// Fetch Data for Exam Dialog
export const fetchDataForExamDialog = () => {
  return api.get('/exams/addExamDialogData');
};
