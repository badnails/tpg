
import { useTransaction } from '../hooks/useTransaction';
import LandingStep from '../components/LandingStep';
import UsernameStep from '../components/UsernameStep';
import PinStep from '../components/PinStep';
import SuccessStep from '../components/SuccessStep';
import ErrorStep from '../components/ErrorStep';
import TransactionHeader from '../components/TransactionHeader';
import { AlertCircle } from 'lucide-react';

export default function PaymentGateway() {
  const {
    transactionId,
    redirectURL,
    transactionDetails,
    error,
    isLoading,
    currentStep,
    setCurrentStep,
    fetchTransaction,
    setError,
    setIsLoading,
  } = useTransaction();

  const renderStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingStep
            isLoading={isLoading}
            transactionDetails={transactionDetails}
            onStart={() => setCurrentStep('username')}
          />
        );
      case 'username':
        return <UsernameStep transactionId={transactionId} onSuccess={() => setCurrentStep('pin')} onError={setError} />;
      case 'pin':
        return (
          <PinStep
            transactionId={transactionId}
            transactionDetails={transactionDetails}
            onSuccess={() => setCurrentStep('success')}
            onError={setError}
          />
        );
      case 'success':
        return <SuccessStep redirectURL={redirectURL} />;
      case 'error':
        return <ErrorStep error={error} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <TransactionHeader transactionId={transactionId} currentStep={currentStep} transactionDetails={transactionDetails} />
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && currentStep !== 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
