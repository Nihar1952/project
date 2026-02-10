import { useAuth } from '../context/AuthContext';
import { useFiles } from '../context/FileContext';
import UploadForm from '../components/UploadForm';
import FileCard from '../components/FileCard';

export default function Dashboard() {
  const { user } = useAuth();
  const { files } = useFiles();
  const recentFiles = files.slice(0, 5);

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-400 mb-8">Welcome back, {user?.email}</p>

        <div className="grid gap-8 lg:grid-cols-[1fr,1fr]">
          <div>
            <UploadForm />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Recent uploads</h2>
            {recentFiles.length > 0 ? (
              <div className="space-y-3">
                {recentFiles.map((f) => (
                  <FileCard key={f.fileId} file={f} />
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm py-6">No files yet. Upload one above.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
