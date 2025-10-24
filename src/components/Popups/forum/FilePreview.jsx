import React from "react";
import { FileText } from "lucide-react";

export default function FilePreview({ files }) {
  if (!files || files.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {files.map((file, idx) => (
        <div key={idx} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
          <FileText size={16} />
          <span className="text-xs">{file.name}</span>
        </div>
      ))}
    </div>
  );
}
