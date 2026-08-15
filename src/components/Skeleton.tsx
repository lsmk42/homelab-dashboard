import './Skeleton.css'

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text"></div>
      <div className="skeleton-line skeleton-text short"></div>
    </div>
  )
}

export function SkeletonGauge() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-title"></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div className="skeleton-gauge"></div>
        <div className="skeleton-gauge"></div>
      </div>
      <div className="skeleton-line skeleton-text" style={{ marginTop: '16px' }}></div>
      <div className="skeleton-line skeleton-text"></div>
    </div>
  )
}
