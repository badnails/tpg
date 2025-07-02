
import { CheckCircle, Loader } from 'lucide-react';
import TransactionDetailBox from './TransactionDetailBox';

export default function LandingStep({ isLoading, transactionDetails, onStart }) {
  return (
    <div className="text-center space-y-4">
      <h3 className="text-2xl font-semibold text-gray-800">
        Welcome to the Payment Gateway
      </h3>
      <p className="text-gray-600 text-sm">
        Click below to begin the secure payment process.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin h-6 w-6 text-blue-600" />
        </div>
      ) : (
        <>
          {transactionDetails && (
            <div className="border border-green-300 bg-green-50 p-4 rounded-md shadow-sm">
              <div className="flex items-center space-x-2 text-green-700 text-sm font-medium mb-2">
                <CheckCircle className="h-5 w-5" />
                <span>Transaction loaded successfully</span>
              </div>
              <TransactionDetailBox transactionDetails={transactionDetails} />
            </div>
          )}
          <button
            onClick={onStart}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Start Payment
          </button>
        </>
      )}
    </div>
  );
}
