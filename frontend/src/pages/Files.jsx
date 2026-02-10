import { useFiles } from '../context/FileContext';
import FileCard from '../components/FileCard';

export default function Files() {
  const { files } = useFiles();

  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">My Files</h1>
        <p className="text-slate-400 mb-8">
          Files you've uploaded. Download or view blockchain audit trails.
        </p>

        {files.length > 0 ? (
          <div className="space-y-4">
            {files.map((f) => (
              <FileCard key={f.fileId} file={f} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800/30 rounded-xl border border-slate-700 border-dashed">
            <p className="text-slate-500 mb-2">No files yet</p>
            <p className="text-slate-600 text-sm">
              Upload files from the Dashboard or Upload page to see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
