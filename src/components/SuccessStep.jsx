
import { CheckCircle } from 'lucide-react';

export default function SuccessStep({ redirectURL }) {
  return (
    <div className="text-center">
      <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">
        Payment Successful!
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Your transaction was processed.
      </p>
      <button
        onClick={() => {
          let url = redirectURL || '/gateway';
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'http://' + url;
          }
          window.location.href = url;
        }}
        className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Close
      </button>
    </div>
  );
}
