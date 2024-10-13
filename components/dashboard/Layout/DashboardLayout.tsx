// components/dashboard/DashboardLayout.tsx
import React, {useState} from 'react';
import Sidebar from './Sidebar';
import styles from '../css/DashboardLayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

   

    return (
        <div className={styles.dashboardContainer}>
            
            <Sidebar />
            <main className={styles.mainContent}
            style={{ marginLeft: collapsed ? '80px' : '0px' }} // Adjust based on collapse state
            >
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
