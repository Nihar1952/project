import { createContext, useContext, useState, useCallback } from 'react';

const FileContext = createContext(null);

const STORAGE_KEY = 'secure_files_uploaded';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(files) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
}

export function FileProvider({ children }) {
  const [files, setFiles] = useState(loadFromStorage);

  const addFile = useCallback((file) => {
    setFiles((prev) => {
      const next = [file, ...prev];
      saveToStorage(next);
      return next;
    });
  }, []);

  const value = { files, addFile };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
}

export function useFiles() {
  const ctx = useContext(FileContext);
  if (!ctx) throw new Error('useFiles must be used within FileProvider');
  return ctx;
}
