
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function TransactionHeader({ transactionId, currentStep, transactionDetails }) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Secure Payment Gateway
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600 flex items-center justify-center gap-2">
        Transaction ID: {transactionId || "Not found"}
        {currentStep === "error" ? (
          <AlertCircle className="h-4 w-4 text-red-600" />
        ) : transactionDetails ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : null}
      </p>
    </div>
  );
}
