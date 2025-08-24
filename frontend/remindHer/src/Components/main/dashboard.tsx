import React, { type ReactNode } from 'react';
import SideBar  from './sideBar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const Dashboard: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <main className="flex-1 bg-gray-50 p-8">
                {children}
            </main>
        </div>
    )
}

export default Dashboard;