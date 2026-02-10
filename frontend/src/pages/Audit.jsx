import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fileApi } from '../api';
import { useFiles } from '../context/FileContext';
import AuditTable from '../components/AuditTable';
import toast from 'react-hot-toast';

export default function Audit() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { files } = useFiles();
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  const file = files.find((f) => f.fileId === fileId);

  useEffect(() => {
    if (!fileId) return;
    let cancelled = false;
    setLoading(true);
    fileApi
      .getAudit(fileId)
      .then((res) => {
        if (!cancelled) setAudits(res.data.audits || []);
      })
      .catch((err) => {
        if (!cancelled) {
          const msg = err.response?.data?.error || err.message || 'Failed to load audit';
          toast.error(typeof msg === 'string' ? msg : 'Failed to load audit');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fileId]);

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-white text-sm mb-6 flex items-center gap-2"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-white mb-2">Audit Trail</h1>
        <p className="text-slate-400 mb-6">
          {file ? (
            <>Blockchain audit history for <span className="text-slate-200 font-medium">{file.originalName || fileId}</span></>
          ) : (
            <>File ID: <code className="text-slate-300">{fileId}</code></>
          )}
        </p>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <AuditTable audits={audits} />
        )}
      </div>
    </div>
  );
}
