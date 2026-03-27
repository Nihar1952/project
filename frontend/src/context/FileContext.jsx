import { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client';

const FileContext = createContext(null);

export function FileProvider({ children }) {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const uploaded = await apiClient.get('/files/uploaded-by-me');
      const shared = await apiClient.get('/files/shared-with-me');

      setFiles([...uploaded.data, ...shared.data]);
    } catch (err) {
      console.error('Failed to fetch files', err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const addFile = (file) => {
    setFiles((prev) => [file, ...prev]);
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return (
    <FileContext.Provider value={{ files, addFile, fetchFiles, clearFiles }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error('useFiles must be used within FileProvider');
  return ctx;
}