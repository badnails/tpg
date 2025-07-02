
const API_BASE_URL = "http://localhost:1111";

export const getTrxDetails = async (trxID) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/get-trx-details/${trxID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          apikey: "13acc245-b584-4767-b80a-5c9a1fe9d71e",
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.log(err);
    throw new Error('Failed to fetch transaction details');
  }
};

export const validateUser = async (username) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gateway/validate-user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to validate user');
  }
};

export const completeTransaction = async (username, password, transactionid) => {
  try {
    console.log(username + ' '+ password+' '+transactionid);
    const response = await fetch(
      `${API_BASE_URL}/api/gateway/finalize-transaction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          transactionid,
        }),
      }
    );
    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error('Failed to complete transaction');
  }
};
