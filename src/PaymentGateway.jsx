import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle, Loader } from "lucide-react";

const API_BASE_URL = "https://test-project-production-88cc.up.railway.app";

const formatTaka = (amount) => `৳${parseFloat(amount).toFixed(2)}`;

export default function PaymentGateway() {
  const [searchParams] = useSearchParams();
  const transactionId = searchParams.get("transactionid");
  const redirectURL = searchParams.get("redirectURL");

  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [currentStep, setCurrentStep] = useState("landing");
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getTrxDetails = async (trxID) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/get-trx-details/${trxID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            apikey: "38983db9-d130-4f5b-94cc-bc7f4820df34",
          },
        }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTransaction = async () => {
    if (!transactionId) {
      setError("No transaction ID found in URL");
      setCurrentStep("error");
      return false;
    }

    setIsLoading(true);
    try {
      const trxData = await getTrxDetails(transactionId);
      if (!trxData.valid) {
        setError(trxData.message || "Invalid transaction");
        setCurrentStep("error");
        return false;
      } else if (trxData.transactionDetails.status === "COMPLETED") {
        setError("Bill has already been paid");
        setCurrentStep("error");
        return false;
      } else {
        setTransactionDetails(trxData.transactionDetails);
        return true;
      }
    } catch (e) {
      console.error(e);
      setError("Transaction data could not be fetched");
      setCurrentStep("error");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const disableBackButton = () => {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    };
    disableBackButton();
    return () => {
      window.onpopstate = null;
    };
  }, []);

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);

  const handleLanding = async () => {
    setIsLoading(true);
    const success = await fetchTransaction();
    if (success) {
      setCurrentStep("username");
    } else {
      setCurrentStep("landing");
    }
    setIsLoading(false);
  };

  const validateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/gateway/validate-user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );

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
      const response = await fetch(
        `${API_BASE_URL}/api/gateway/finalize-transaction`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password: pin,
            transactionid: transactionId,
          }),
        }
      );

      const data = await response.json();
      if (data.valid) {
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

  const TransactionDetailBox = () =>
    transactionDetails && (
      <dl className="text-sm text-gray-800 grid grid-cols-3 gap-y-2">
        <dt className="font-medium">Amount</dt>
        <dd className="col-span-2 text-right">
          {formatTaka(transactionDetails.subamount)}
        </dd>

        <dt className="font-medium">Fee</dt>
        <dd className="col-span-2 text-right">
          {formatTaka(transactionDetails.feesamount)}
        </dd>

        <dt className="font-medium">Biller</dt>
        <dd className="col-span-2 text-right">
          {transactionDetails.recipient}
        </dd>

        <dt className="font-bold pt-2 border-t border-gray-300">Total</dt>
        <dd className="col-span-2 text-right font-bold pt-2 border-t border-gray-300">
          {formatTaka(
            parseFloat(transactionDetails.subamount) +
              parseFloat(transactionDetails.feesamount)
          )}
        </dd>
      </dl>
    );

  const renderStep = () => {
    switch (currentStep) {
      case "landing":
        return isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader className="animate-spin h-6 w-6 text-blue-600" />
          </div>
        ) : (
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-gray-800">
              Welcome to the Payment Gateway
            </h3>
            <p className="text-gray-600 text-sm">
              Click below to begin the secure payment process.
            </p>

            {transactionDetails && (
              <div className="border border-green-300 bg-green-50 p-4 rounded-md shadow-sm">
                <div className="flex items-center space-x-2 text-green-700 text-sm font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Transaction loaded successfully</span>
                </div>
                <TransactionDetailBox />
              </div>
            )}

            <button
              onClick={handleLanding}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Start Payment
            </button>
          </div>
        );

      case "username":
        return (
          <form onSubmit={validateUser} className="space-y-6">
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
                onChange={(e) => setUsername(e.target.value)}
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

      case "pin":
        if (!transactionDetails) {
          return (
            <div className="text-center text-sm text-red-500">
              Transaction details missing.
            </div>
          );
        }

        return (
          <form onSubmit={completeTransaction} className="space-y-6">
            <TransactionDetailBox />
            <div>
              <label
                htmlFor="pin"
                className="block text-sm font-medium text-gray-700"
              >
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
              {isLoading ? (
                <Loader className="animate-spin h-5 w-5" />
              ) : (
                "Pay Now"
              )}
            </button>
          </form>
        );

      case "success":
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
              onClick={() => (window.location.href = redirectURL || "/gateway")}
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
