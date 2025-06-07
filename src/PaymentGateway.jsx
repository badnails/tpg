import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

// Configurable base URL
const API_BASE_URL = "https://test-project-production-88cc.up.railway.app";

export default function PaymentGateway() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionid");
  const expType = searchParams.get("expType");

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [currentStep, setCurrentStep] = useState("error");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetSession = () => {
    sessionStorage.clear();
    setUsername("");
    setPin("");
    setTransactionDetails(null);
    setError("");
    setCurrentStep("username");
  };

  const getTrxDetails = async (trxID) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/gateway/get-trx-details/${trxID}/?expType=${expType}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setError("No transaction ID found in URL");
        setCurrentStep("error");
        return;
      }

      setIsLoading(true);
      try {
        const trxData = await getTrxDetails(transactionId);
        if (!trxData.valid) {
          setError(trxData.message || "Invalid transaction");
          setCurrentStep("error");
        } else {
          setTransactionDetails(trxData);
          setCurrentStep("username");
        }
      } catch (e) {
        console.error(e);
        setError("Transaction data could not be fetched");
        setCurrentStep("error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, expType]);

  const validateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/gateway/validate-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (data.valid) {
        setPin("");
        setCurrentStep("pin");
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("currentStep", "pin");
      } else {
        setError(data.message || "Invalid Username");
        setCurrentStep("error");
      }
    } catch (error) {
      console.error(error);
      setError("User could not be validated");
      setCurrentStep("error");
    } finally {
      setIsLoading(false);
    }
  };

  const completeTransaction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/gateway/finalize-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password: pin,
          transactionid: transactionId,
        }),
      });

      const data = await response.json();
      if (data.valid) {
        resetSession();
        setCurrentStep("success");
      } else {
        setError(data.message || "Invalid PIN");
      }
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "username":
        return (
          <form onSubmit={validateUser} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Continue"}
            </button>
          </form>
        );

      case "pin":
        if (!transactionDetails?.transactionDetails) {
          return <div className="text-center text-sm text-red-500">Transaction details missing.</div>;
        }

        return (
          <form onSubmit={completeTransaction} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <h3 className="text-sm font-medium text-gray-700">Transaction Details</h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Amount: ${transactionDetails.transactionDetails.subamount}</p>
                <p>Fee: ${transactionDetails.transactionDetails.feesamount}</p>
                <p>Biller: {transactionDetails.transactionDetails.recipient}</p>
              </div>
            </div>
            <div>
              <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                PIN
              </label>
              <input
                id="pin"
                type="password"
                maxLength={4}
                inputMode="numeric"
                pattern="\d*"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isLoading ? <Loader className="animate-spin h-5 w-5" /> : "Pay Now"}
            </button>
          </form>
        );

      case "success":
        return (
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Payment Successful!</h3>
            <p className="mt-1 text-sm text-gray-500">Your transaction was processed.</p>
            <button
              onClick={() => (window.location.href = "/gateway")}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Close
            </button>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Transaction Error</h3>
            <p className="mt-1 text-sm text-gray-500">{error || "An unexpected error occurred."}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Secure Payment Gateway</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Transaction ID: {transactionId || "Not found"}
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && currentStep !== "error" && (
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
