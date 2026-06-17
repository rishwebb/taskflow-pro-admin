import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading && !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-50">
        <div className="rounded-lg border border-ink-200 bg-white px-6 py-5 text-sm font-bold text-ink-700 shadow-panel">
          Checking admin session
        </div>
      </div>
    );
  }

  return user ? <AdminDashboard /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
