import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InstallButton from '../components/InstallButton';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-layout">

      {/* SIDEBAR */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="dashboard-main">

        {/* HEADER */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <main className="dashboard-content">

          {/* BOTÃO DE INSTALAÇÃO PWA */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 12
            }}
          >
            <InstallButton />
          </div>

          <Outlet />
        </main>

      </div>
    </div>
  );
}
