
const formatTaka = (amount) => `৳${parseFloat(amount).toFixed(2)}`;

export default function TransactionDetailBox({ transactionDetails }) {
  return (
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
}
