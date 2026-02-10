import apiClient from './client';

export const authApi = {
  register: (data) =>
    apiClient.post('/auth/register', data),

  login: (data) =>
    apiClient.post('/auth/login', data),
};

export const fileApi = {
  upload: (formData, onProgress) =>
    apiClient.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(e.loaded / (e.total || 1))
        : undefined,
    }),

  download: (fileId, password) =>
    apiClient.post(`/download/${fileId}`, { password }, {
      responseType: 'blob',
    }),

  getAudit: (fileId) =>
    apiClient.get(`/audit/${fileId}`),
};
