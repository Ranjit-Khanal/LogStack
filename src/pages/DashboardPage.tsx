import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEntries, useTags } from '../hooks/useEntries';
import { useAuthStore } from '../store/authStore';
import EntryCard from '../components/entries/EntryCard';
import TagBadge from '../components/entries/TagBadge';
import Spinner from '../components/ui/Spinner';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError } = useEntries({
    page,
    limit: 10,
    search: search || undefined,
    tags: activeTag || undefined,
  });

  const { data: tags } = useTags();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag((prev) => (prev === tag ? '' : tag));
    setPage(1);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data?.entries || [], null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Journal</h1>
          <p className={styles.subtitle}>
            {data?.total ?? 0} entries · 🔥 {user?.streak ?? 0} day streak
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.exportBtn} onClick={exportJSON} title="Export as JSON">
            ↓ Export
          </button>
          <Link to="/entries/new" className={styles.newBtn}>
            + New Entry
          </Link>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search entries..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>Search</button>
        {(search || activeTag) && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setSearch('');
              setSearchInput('');
              setActiveTag('');
              setPage(1);
            }}
          >
            Clear
          </button>
        )}
      </form>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className={styles.tagRow}>
          {tags.map((tag: string) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={handleTagClick}
            />
          ))}
        </div>
      )}

      {/* Entries */}
      {isLoading && <Spinner centered />}

      {isError && (
        <div className={styles.error}>Failed to load entries. Please try again.</div>
      )}

      {!isLoading && !isError && data?.entries?.length === 0 && (
        <div className={styles.empty}>
          <p>No entries found.</p>
          {!search && !activeTag && (
            <Link to="/entries/new" className={styles.emptyLink}>
              Create your first entry →
            </Link>
          )}
        </div>
      )}

      {!isLoading && data?.entries && (
        <div className={styles.timeline}>
          {data.entries.map((entry: any) => (
            <EntryCard key={entry._id} entry={entry} onTagClick={handleTagClick} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className={styles.pageBtn}
          >
            ← Prev
          </button>
          <span className={styles.pageInfo}>
            {page} / {data.pages}
          </span>
          <button
            disabled={page === data.pages}
            onClick={() => setPage((p) => p + 1)}
            className={styles.pageBtn}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
