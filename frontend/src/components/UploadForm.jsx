import { useState } from 'react';
import { fileApi } from '../api';
import { useFiles } from '../context/FileContext';
import toast from 'react-hot-toast';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [recipients, setRecipients] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const { addFile } = useFiles();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const emails = recipients
        .split(/[,\s]+/)
        .map((e) => e.trim())
        .filter(Boolean);
      emails.forEach((email) => formData.append('recipients', email));

      const res = await fileApi.upload(formData, (p) => setProgress(Math.round(p * 100)));

      const data = res.data;
      addFile({
        fileId: data.fileId,
        originalName: file.name,
        cid: data.cid,
        sensitivity: data.sensitivity,
        uploadedAt: new Date().toISOString(),
      });

      setResult(data);
      setFile(null);
      setRecipients('');
      toast.success('File uploaded successfully');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Upload failed';
      toast.error(typeof msg === 'string' ? msg : 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-600 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Upload File</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">File</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={uploading}
            className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-600 file:text-white file:font-medium file:cursor-pointer hover:file:bg-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Recipients (optional, comma-separated emails)
          </label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            placeholder="user@example.com, other@example.com"
            disabled={uploading}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {uploading && (
          <div className="space-y-2">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-400">Uploading… {progress}%</p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-slate-900 border border-slate-600">
          <p className="text-sm font-medium text-slate-300 mb-2">Upload result</p>
          <ul className="text-sm space-y-1 text-slate-400">
            <li><span className="text-slate-500">fileId:</span> <code className="text-slate-200">{result.fileId}</code></li>
            <li><span className="text-slate-500">CID:</span> <code className="text-slate-200 break-all">{result.cid}</code></li>
            <li><span className="text-slate-500">Sensitivity:</span> <span className="text-slate-200">{result.sensitivity}</span></li>
          </ul>
        </div>
      )}
    </div>
  );
}
