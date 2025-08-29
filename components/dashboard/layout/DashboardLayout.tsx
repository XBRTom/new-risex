// components/dashboard/DashboardLayout.tsx
import React from 'react';
import Sidebar from './Sidebar';
import styles from '../css/DashboardLayout.module.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className={styles.dashboardContainer}>
            <Sidebar />
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
