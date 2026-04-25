import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/dashboard" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>LogStack</span>
        </Link>

        <div className={styles.links}>
          <Link
            to="/dashboard"
            className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}
          >
            Timeline
          </Link>
          <Link
            to="/entries/new"
            className={`${styles.newBtn}`}
          >
            + New Entry
          </Link>
        </div>

        <div className={styles.right}>
          {user && (
            <div className={styles.streak} title="Current streak">
              🔥 {user.streak} day{user.streak !== 1 ? 's' : ''}
            </div>
          )}
          <Link to="/profile" className={styles.avatar} title="Profile">
            {user?.name?.charAt(0).toUpperCase()}
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
