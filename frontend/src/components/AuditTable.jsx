export default function AuditTable({ audits }) {
  if (!audits?.length) {
    return (
      <p className="text-slate-400 text-sm py-6 text-center">
        No audit records found for this file.
      </p>
    );
  }

  const formatDate = (ts) => {
    const d = new Date(ts * 1000);
    return d.toLocaleString();
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-600">
      <table className="w-full text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-300">Action</th>
            <th className="px-4 py-3 text-left font-medium text-slate-300">User ID</th>
            <th className="px-4 py-3 text-left font-medium text-slate-300">CID</th>
            <th className="px-4 py-3 text-left font-medium text-slate-300">Timestamp</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {audits.map((a, i) => (
            <tr key={i} className="bg-slate-800/50 hover:bg-slate-800">
              <td className="px-4 py-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                    a.action === 'UPLOAD'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}
                >
                  {a.action}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300 font-mono text-xs">{a.userId}</td>
              <td className="px-4 py-3 text-slate-400 font-mono text-xs truncate max-w-[200px]">
                {a.cid}
              </td>
              <td className="px-4 py-3 text-slate-400">{formatDate(a.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
