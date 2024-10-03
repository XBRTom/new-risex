import React from 'react';

const TransactionTable = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="transaction-table">
        <h2 className="table-title">Transactions</h2>
        <p>No transactions found.</p>
      </div>
    );
  }
  return (
    <div className="transaction-table">
      <h2 className="table-title">Transactions</h2>
      <table className="table">
      <thead>
        <tr>
          <th className="py-2">Date</th>
          <th className="py-2">Type</th>
          <th className="py-2">Amount</th>
          <th className="py-2">Earnings</th>
          <th className="py-2">Impermanent Loss</th>
        </tr>
      </thead>
        <tbody>
        {transactions.map((tx, index) => (
          <tr key={index} className="text-center">
            <td className="py-2">{tx.date}</td>
            <td className="py-2">{tx.type}</td>
            <td className="py-2">{tx.amount}</td>
            <td className="py-2">{tx.earnings}</td>
            <td className="py-2">{tx.impermanentLoss}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
