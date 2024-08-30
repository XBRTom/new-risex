import React, { useState, useEffect } from 'react';
import Transactions from './Transactions';
import ProvideLiquidity from './ProvideLiquidity';
import SendXRP from './SendXrp'; // Import SendXRP component
import { Xumm } from 'xumm';
import { useWallet } from './WalletContext'; // Import useWallet hook

// const xumm = new Xumm('5ea5cad0-1d8e-4cee-a31e-96a8f2297dea');

// const App = () => {
//   const [account, setAccount] = useState('');
//   const [appName, setAppName] = useState('');
//   const [status, setStatus] = useState('');
//   // const [wallet, setWallet] = useState(null);

//   useEffect(() => {
//     const getAccount = async () => {
//       const userAccount = await xumm.user.account;
//       setAccount(userAccount || '');
//    };

//     const getAppName = async () => {
//      const appDetails = await xumm.environment.jwt;
//      setAppName(appDetails?.app_name || '');
//     };

//     const queryParams = new URLSearchParams(window.location.search);
//     if (queryParams.get('status')) {
//       setStatus(queryParams.get('status'));
//     }

//     getAccount();
//     getAppName();
//   }, []);

//   const handleLogin = async () => {
//     try {
//       await xumm.authorize();
//       const userAccount = await xumm.user.account;
//       setAccount(userAccount || '');
//       const appDetails = await xumm.environment.jwt;
//       setAppName(appDetails?.app_name || '');
//     } catch (error) {
//       console.error('Authorization failed:', error);
//     }
//   };

//   const handleLogout = () => {
//     xumm.logout();
//     setAccount('');
//     setAppName('');
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Welcome to the Risex Ledger App</h1>
//       <p>Use the menu to navigate to different sections of the app.</p>
//       <h2>{appName}</h2>
//       {account ? (
//         <div>
//           <p>Connected account: <b>{account}</b></p>
//           <button onClick={handleLogout}>Logout</button>
//           <ProvideLiquidity account={account} xumm={xumm} />
//           <SendXRP account={account} xumm={xumm} />
//           <Transactions account={account} />
//         </div>
//       ) : (
//         <button onClick={handleLogin}>Connect to XUMM</button>
//       )}
//     </div>
//   );
// };

// export default App;

const App = () => {
  const { account, appName, handleLogin, handleLogout } = useWallet();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Risex Ledger App</h1>
      <p>Use the menu to navigate to different sections of the app.</p>
      <h2>{appName}</h2>
      {account ? (
        <div>
          <p>Connected account: <b>{account}</b></p>
          <button onClick={handleLogout}>Logout</button>
          <ProvideLiquidity account={account} />
          <SendXRP account={account} />
        </div>
      ) : (
        <button onClick={handleLogin}>Connect to XUMM</button>
      )}
    </div>
  );
};

export default App;

