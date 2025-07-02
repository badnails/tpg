
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTrxDetails } from '../services/api';

export function useTransaction() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get('transactionid');
  const redirectURL = searchParams.get('redirectURL');

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('landing');

  const fetchTransaction = useCallback(async () => {
    if (!transactionId) {
      setError('No transaction ID found in URL');
      setCurrentStep('error');
      return false;
    }

    setIsLoading(true);
    try {
      const trxData = await getTrxDetails(transactionId);
      if (!trxData.valid) {
        setError(trxData.message || 'Invalid transaction');
        setCurrentStep('error');
        return false;
      }
      if (trxData.transactionDetails.status === 'COMPLETED') {
        setError('Bill has already been paid');
        setCurrentStep('error');
        return false;
      }
      setTransactionDetails(trxData.transactionDetails);
      return true;
    } catch (e) {
      console.error(e);
      setError('Transaction data could not be fetched');
      setCurrentStep('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    fetchTransaction();
  }, [fetchTransaction]);

  return {
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
  };
}
