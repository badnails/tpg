
import { useState } from 'react';
import { Loader, Eye, EyeOff } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';
import TransactionDetailBox from './TransactionDetailBox';

export default function PinStep({ transactionId, transactionDetails, onSuccess, onError }) {
  const { password, setPassword, isLoading, handleTransactionCompletion } = usePayment(transactionId, onSuccess, onError);
  const [showPassword, setShowPassword] = useState(false);

  if (!transactionDetails) {
    return (
      <div className="text-center text-sm text-red-500">
        Transaction details missing.
      </div>
    );
  }

  return (
    <form onSubmit={handleTransactionCompletion} className="space-y-6">
      <TransactionDetailBox transactionDetails={transactionDetails} />
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1 relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              onError(null);
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          >
            {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        {isLoading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
}
