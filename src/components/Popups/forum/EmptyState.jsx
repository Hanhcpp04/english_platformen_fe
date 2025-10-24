import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
      <Inbox size={48} />
      <p className="mt-4 text-lg">{message}</p>
    </div>
  );
}
