import './styles.css';

function Skeleton({ width }) {
  return (
    <span className="dcv-skeleton" style={{ width }}>
      <span className="dcv-skeleton-line">&nbsp;</span>
    </span>
  );
}

export default Skeleton;
