import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from './WalletContext';
import '../layout.css'; // Ensure you have a corresponding CSS file

const Layout = ({ children }) => {
  const { account, handleLogin } = useWallet();
  const [showMenu, setShowMenu] = useState(false);

  const handleMouseEnter = () => {
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    setShowMenu(false);
  };

  return (
    <div>
      <nav style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
          <Link to="/allamms" style={{ marginRight: '10px' }}>All Amms</Link>
          <Link to="/transactions">Transactions</Link>
        </div>
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ position: 'relative', cursor: 'pointer' }}
        >
          {account ? (
            <>
              <span className="wallet-account">Wallet: {account}</span>
              {showMenu && (
                <div className="hover-menu">
                  <ul>
                    <li><Link to="/transactions">Transactions</Link></li>
                    <li><Link to="/amm-deposits">AMM Deposits</Link></li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <button onClick={handleLogin}>Connect My Account</button>
          )}
        </div>
      </nav>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
