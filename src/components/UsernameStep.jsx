
import { Loader } from 'lucide-react';
import { usePayment } from '../hooks/usePayment';

export default function UsernameStep({ transactionId, onSuccess, onError }) {
  const { username, setUsername, isLoading, handleUserValidation } = usePayment(transactionId, onSuccess, onError);

  return (
    <form onSubmit={handleUserValidation} className="space-y-6">
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          required
          autoFocus
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            onError(null);
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        {isLoading ? (
          <Loader className="animate-spin h-5 w-5" />
        ) : (
          "Continue"
        )}
      </button>
    </form>
  );
}
