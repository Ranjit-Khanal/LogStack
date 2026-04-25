import styles from './Spinner.module.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export default function Spinner({ size = 'md', centered = false }: Props) {
  return (
    <div className={centered ? styles.centered : undefined}>
      <div className={`${styles.spinner} ${styles[size]}`} />
    </div>
  );
}
