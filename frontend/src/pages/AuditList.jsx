import { useNavigate } from 'react-router-dom';
import { useFiles } from '../context/FileContext';

export default function AuditList() {
  const { files } = useFiles();
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Audit Logs</h1>
        <p className="text-slate-400 mb-8">
          Select a file to view its blockchain audit trail (uploads and downloads).
        </p>

        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((f) => (
              <div
                key={f.fileId}
                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div>
                  <p className="font-medium text-white">{f.originalName || 'Untitled'}</p>
                  <p className="text-xs text-slate-500 font-mono">{f.fileId}</p>
                </div>
                <button
                  onClick={() => navigate(`/audit/${f.fileId}`)}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors"
                >
                  View Audit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
            <p className="text-slate-500 mb-2">No files to audit</p>
            <p className="text-slate-600 text-sm">
              Upload files first, then view their blockchain audit trails here.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500"
            >
              Upload File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
