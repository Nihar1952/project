import UploadForm from '../components/UploadForm';

export default function Upload() {
  return (
    <div className="flex-1 p-6 lg:p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Upload File</h1>
        <p className="text-slate-400 mb-6">
          Files are encrypted, classified by sensitivity, and stored on IPFS with blockchain audit logging.
        </p>
        <UploadForm />
      </div>
    </div>
  );
}
