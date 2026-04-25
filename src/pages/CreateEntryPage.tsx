import { Link } from 'react-router-dom';
import EntryForm from '../components/entries/EntryForm';
import styles from './EntryPage.module.css';

export default function CreateEntryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/dashboard" className={styles.back}>← Back</Link>
        <h1 className={styles.title}>New Entry</h1>
      </div>
      <EntryForm />
    </div>
  );
}
