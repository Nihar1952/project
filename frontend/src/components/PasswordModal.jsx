import { useState } from 'react';

export default function PasswordModal({ isOpen, onClose, onConfirm, fileName }) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onConfirm(password);
      setPassword('');
      onClose();
    }
  };

  const handleClose = () => {
    setPassword('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-slate-800 rounded-xl shadow-xl border border-slate-600 w-full max-w-md p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Enter password</h3>
        <p className="text-sm text-slate-400 mb-4">
          Decryption key for <span className="text-slate-200 font-medium">{fileName}</span>
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-4"
            autoFocus
          />
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Decrypt & Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
