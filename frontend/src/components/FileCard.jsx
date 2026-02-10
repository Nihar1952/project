import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fileApi } from '../api';
import toast from 'react-hot-toast';
import PasswordModal from './PasswordModal';

export default function FileCard({ file }) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const navigate = useNavigate();

  const sensitivityColor = {
    LOW: 'bg-emerald-500/20 text-emerald-400',
    MEDIUM: 'bg-amber-500/20 text-amber-400',
    HIGH: 'bg-red-500/20 text-red-400',
  };

  const handleDownloadClick = () => setShowPasswordModal(true);

  const handleDownload = async (password) => {
    setDownloading(true);
    try {
      const res = await fileApi.download(file.fileId, password);
      const blob = new Blob([res.data]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName || 'download';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('File downloaded');
    } catch (err) {
      let msg = 'Download failed';
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          msg = json.error || text;
        } catch {}
      } else {
        msg = err.response?.data?.error || err.message || msg;
      }
      toast.error(typeof msg === 'string' ? msg : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const dateStr = file.createdAt
    ? new Date(file.createdAt).toLocaleString()
    : file.uploadedAt
    ? new Date(file.uploadedAt).toLocaleString()
    : '—';

  return (
    <>
      <div className="bg-slate-800/50 rounded-xl border border-slate-600 p-5 hover:border-slate-500 transition-colors">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-medium text-white truncate">{file.originalName || 'Untitled'}</p>
            <p className="text-xs text-slate-500 font-mono mt-1 truncate">{file.fileId}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span
                className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                  sensitivityColor[file.sensitivity] || sensitivityColor.HIGH
                }`}
              >
                {file.sensitivity || 'HIGH'}
              </span>
              <span className="text-xs text-slate-500">CID: {file.cid?.slice(0, 12)}…</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{dateStr}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 disabled:opacity-50 transition-colors"
            >
              {downloading ? '…' : 'Download'}
            </button>
            <button
              onClick={() => navigate(`/audit/${file.fileId}`)}
              className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-600 transition-colors"
            >
              View Audit
            </button>
          </div>
        </div>
      </div>

      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handleDownload}
        fileName={file.originalName || file.fileId}
      />
    </>
  );
}
