import styles from './TagBadge.module.css';

interface Props {
  tag: string;
  onClick?: (tag: string) => void;
  active?: boolean;
}

export default function TagBadge({ tag, onClick, active }: Props) {
  return (
    <button
      className={`${styles.badge} ${active ? styles.active : ''} ${onClick ? styles.clickable : ''}`}
      onClick={() => onClick?.(tag)}
      type="button"
    >
      #{tag}
    </button>
  );
}
