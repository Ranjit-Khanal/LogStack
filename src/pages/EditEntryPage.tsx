import { Link, useParams } from 'react-router-dom';
import { useEntry } from '../hooks/useEntries';
import EntryForm from '../components/entries/EntryForm';
import Spinner from '../components/ui/Spinner';
import styles from './EntryPage.module.css';

export default function EditEntryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: entry, isLoading, isError } = useEntry(id!);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/dashboard" className={styles.back}>← Back</Link>
        <h1 className={styles.title}>Edit Entry</h1>
      </div>

      {isLoading && <Spinner centered />}
      {isError && <p className={styles.error}>Entry not found.</p>}
      {entry && <EntryForm existingEntry={entry} />}
    </div>
  );
}
