import React from "react";

interface LoadingProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}

export function LoadingOverlay({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="fixed inset-0 bg-[#0d1117]/80 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
