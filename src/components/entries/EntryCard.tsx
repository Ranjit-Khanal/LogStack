import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JournalEntry } from '../../types';
import { useDeleteEntry } from '../../hooks/useEntries';
import TagBadge from './TagBadge';
import styles from './EntryCard.module.css';

interface Props {
  entry: JournalEntry;
  onTagClick?: (tag: string) => void;
}

export default function EntryCard({ entry, onTagClick }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const { mutate: deleteEntry, isPending } = useDeleteEntry();

  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = () => {
    if (window.confirm('Delete this entry? This cannot be undone.')) {
      deleteEntry(entry._id);
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.dateLine}>
        <span className={styles.dot} />
        <time className={styles.date}>{formattedDate}</time>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => setShowMarkdown((v) => !v)}
            title="Toggle markdown preview"
          >
            {showMarkdown ? 'Raw' : 'MD'}
          </button>
          <Link to={`/entries/${entry._id}/edit`} className={styles.actionBtn}>
            Edit
          </Link>
          <button
            className={`${styles.actionBtn} ${styles.danger}`}
            onClick={handleDelete}
            disabled={isPending}
          >
            Delete
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <Section
          label="Key Learnings"
          content={entry.keyLearnings}
          showMarkdown={showMarkdown}
          accent
        />

        {expanded && (
          <>
            {entry.tasksWorkedOn && (
              <Section label="Tasks / Projects" content={entry.tasksWorkedOn} showMarkdown={showMarkdown} />
            )}
            {entry.challenges && (
              <Section label="Challenges" content={entry.challenges} showMarkdown={showMarkdown} />
            )}
            {entry.nextSteps && (
              <Section label="Next Steps" content={entry.nextSteps} showMarkdown={showMarkdown} />
            )}
          </>
        )}

        {(entry.tasksWorkedOn || entry.challenges || entry.nextSteps) && (
          <button className={styles.expandBtn} onClick={() => setExpanded((v) => !v)}>
            {expanded ? '↑ Show less' : '↓ Show more'}
          </button>
        )}

        {entry.tags.length > 0 && (
          <div className={styles.tags}>
            {entry.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} onClick={onTagClick} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function Section({
  label,
  content,
  showMarkdown,
  accent,
}: {
  label: string;
  content: string;
  showMarkdown: boolean;
  accent?: boolean;
}) {
  return (
    <div className={`${styles.section} ${accent ? styles.accentSection : ''}`}>
      <span className={styles.sectionLabel}>{label}</span>
      {showMarkdown ? (
        <div className={styles.markdown}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      ) : (
        <p className={styles.sectionContent}>{content}</p>
      )}
    </div>
  );
}
