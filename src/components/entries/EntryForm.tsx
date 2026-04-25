import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { JournalEntry, EntryFormData } from '../../types';
import { useCreateEntry, useUpdateEntry } from '../../hooks/useEntries';
import styles from './EntryForm.module.css';

interface Props {
  existingEntry?: JournalEntry;
}

const emptyForm: EntryFormData = {
  date: new Date().toISOString().split('T')[0],
  keyLearnings: '',
  tasksWorkedOn: '',
  challenges: '',
  nextSteps: '',
  tags: '',
  isPublic: false,
};

export default function EntryForm({ existingEntry }: Props) {
  const navigate = useNavigate();
  const createMutation = useCreateEntry();
  const updateMutation = useUpdateEntry(existingEntry?._id || '');

  const [form, setForm] = useState<EntryFormData>(emptyForm);

  useEffect(() => {
    if (existingEntry) {
      setForm({
        date: existingEntry.date.split('T')[0],
        keyLearnings: existingEntry.keyLearnings,
        tasksWorkedOn: existingEntry.tasksWorkedOn,
        challenges: existingEntry.challenges,
        nextSteps: existingEntry.nextSteps,
        tags: existingEntry.tags.join(', '),
        isPublic: existingEntry.isPublic,
      });
    }
  }, [existingEntry]);

  // Cmd+Enter / Ctrl+Enter to save
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('submit-btn')?.click();
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const set = (key: keyof EntryFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    };

    if (existingEntry) {
      updateMutation.mutate(payload, { onSuccess: () => navigate('/dashboard') });
    } else {
      createMutation.mutate(payload, { onSuccess: () => navigate('/dashboard') });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.header}>
        <input
          type="date"
          value={form.date}
          onChange={set('date')}
          className={styles.dateInput}
        />
        <label className={styles.publicToggle}>
          <input
            type="checkbox"
            checked={form.isPublic}
            onChange={(e) => setForm((f) => ({ ...f, isPublic: e.target.checked }))}
          />
          <span>Public</span>
        </label>
      </div>

      <Field
        label="Key Learnings *"
        hint="What did you learn today?"
        value={form.keyLearnings}
        onChange={set('keyLearnings')}
        rows={5}
        required
      />
      <Field
        label="Tasks / Projects Worked On"
        hint="What did you build or contribute to?"
        value={form.tasksWorkedOn}
        onChange={set('tasksWorkedOn')}
        rows={3}
      />
      <Field
        label="Challenges / Problems Faced"
        hint="What blocked you? How did you try to solve it?"
        value={form.challenges}
        onChange={set('challenges')}
        rows={3}
      />
      <Field
        label="Next Steps"
        hint="What will you do tomorrow?"
        value={form.nextSteps}
        onChange={set('nextSteps')}
        rows={3}
      />

      <div className={styles.field}>
        <label className={styles.label}>Tags</label>
        <p className={styles.hint}>Comma-separated: react, typescript, algorithms</p>
        <input
          type="text"
          value={form.tags}
          onChange={set('tags')}
          placeholder="react, node, css"
          className={styles.input}
        />
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.cancelBtn}
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </button>
        <button
          id="submit-btn"
          type="submit"
          className={styles.submitBtn}
          disabled={isPending || !form.keyLearnings.trim()}
        >
          {isPending ? 'Saving...' : existingEntry ? 'Update Entry' : 'Save Entry'}
        </button>
        <span className={styles.shortcutHint}>⌘ + Enter to save</span>
      </div>
    </form>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
}

function Field({ label, hint, value, onChange, rows = 4, required }: FieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {hint && <p className={styles.hint}>{hint}</p>}
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className={styles.textarea}
        placeholder="Markdown supported..."
      />
    </div>
  );
}
