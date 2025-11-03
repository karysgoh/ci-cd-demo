import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-[1000px] px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">
          CI/CD Demo
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-slate-600 hover:text-slate-900">
                Tasks
              </Link>
              <Link to="/admin/users" className="text-slate-600 hover:text-slate-900">
                Users
              </Link>
              <span className="text-sm text-slate-500">{user?.username}</span>
              <button
                onClick={logout}
                className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link to="/register" className="text-slate-600 hover:text-slate-900">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
