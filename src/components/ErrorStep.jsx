
import { AlertCircle } from 'lucide-react';

export default function ErrorStep({ error }) {
  return (
    <div className="text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        Transaction Error
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {error || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Try Again
      </button>
    </div>
  );
}
