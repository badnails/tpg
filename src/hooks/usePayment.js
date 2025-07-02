
import { useState } from 'react';
import { validateUser, completeTransaction } from '../services/api';
import { ChartNoAxesColumnDecreasing } from 'lucide-react';

export function usePayment(transactionId, onSuccess, onError) {
  const [username, setUsername] = useState(
    sessionStorage.getItem('username') || ''
  );
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUserValidation = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await validateUser(username);
      console.log(data);
      if (data.valid) {
        setPassword('');
        sessionStorage.setItem('username', username);
        onSuccess();
      } else {
        onError(data.message || 'Invalid Username');
      }
    } catch (error) {
      onError('User could not be validated');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransactionCompletion = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await completeTransaction(username, password, transactionId);
      if (data.valid) {
        onSuccess();
      } else {
        onError(data.message || 'Invalid Password');
      }
    } catch (err) {
      onError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    isLoading,
    handleUserValidation,
    handleTransactionCompletion,
  };
}
