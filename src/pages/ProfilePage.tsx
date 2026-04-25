import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      await authApi.updateProfile({ name, isPublic });
      updateUser({ name, isPublic });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const publicProfileUrl = `${window.location.origin}/profile/${user?._id}`;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile Settings</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label>Email</label>
          <input type="email" value={user?.email || ''} disabled className={styles.disabled} />
        </div>

        <div className={styles.toggleRow}>
          <div>
            <p className={styles.toggleLabel}>Public Portfolio</p>
            <p className={styles.toggleDesc}>
              Allow others to view your public entries at your profile URL
            </p>
          </div>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className={styles.slider} />
          </label>
        </div>

        {isPublic && (
          <div className={styles.publicUrl}>
            <span className={styles.urlLabel}>Your public URL:</span>
            <a href={publicProfileUrl} target="_blank" rel="noreferrer" className={styles.url}>
              {publicProfileUrl}
            </a>
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
        {saved && <p className={styles.success}>✓ Profile updated successfully</p>}

        <button type="submit" disabled={loading} className={styles.btn}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>🔥 {user?.streak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
      </div>
    </div>
  );
}
