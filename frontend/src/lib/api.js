import axios from 'axios';

// Use relative URL for Vercel deployment (same domain)
// Or set REACT_APP_BACKEND_URL in Vercel environment variables
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 45000, // 45 second timeout for API calls
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ============================================================
// AUTH API
// ============================================================

export const authAPI = {
  login: async (provider, email) => {
    const response = await api.post('/auth/login', null, {
      params: { provider, email },
    });
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    return response.data;
  },
};

// ============================================================
// TICKET API
// ============================================================

export const ticketAPI = {
  list: async (filters = {}) => {
    const response = await api.get('/tickets', { params: filters });
    return response.data;
  },
  
  get: async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
  },
  
  update: async (ticketId, data) => {
    const response = await api.patch(`/tickets/${ticketId}`, data);
    return response.data;
  },
};

// ============================================================
// MESSAGE API
// ============================================================

export const messageAPI = {
  create: async (ticketId, body, direction = 'outbound') => {
    const response = await api.post('/messages', null, {
      params: { ticket_id: ticketId, body, direction },
    });
    return response.data;
  },
};

// ============================================================
// STUDENT API
// ============================================================

export const studentAPI = {
  list: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  
  get: async (studentId) => {
    const response = await api.get(`/students/${studentId}`);
    return response.data;
  },
  
  update: async (studentId, data) => {
    const response = await api.patch(`/students/${studentId}`, data);
    return response.data;
  },
};

// ============================================================
// QUEUE & USER API
// ============================================================

export const queueAPI = {
  list: async () => {
    const response = await api.get('/queues');
    return response.data;
  },
};

export const userAPI = {
  list: async () => {
    const response = await api.get('/users');
    return response.data;
  },
};

// ============================================================
// AI TOOLS API
// ============================================================

export const aiToolsAPI = {
  draftReply: async (data) => {
    const response = await api.post('/tools/draft_reply', data);
    return response.data;
  },
  
  searchKB: async (data) => {
    const response = await api.post('/tools/search_kb_articles', data);
    return response.data;
  },
  
  addStudentEvent: async (data) => {
    const response = await api.post('/tools/add_student_event', data);
    return response.data;
  },
};
