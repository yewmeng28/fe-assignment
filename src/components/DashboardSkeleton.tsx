import { Card } from './ui/Card'
import Skeleton from './ui/Skeleton'

/**
 * Mirrors the loaded dashboard (same classes, similar heights) so the layout
 * doesn't jump when the data arrives.
 */
export default function DashboardSkeleton() {
  return (
    <div className="dashboard" aria-busy="true">
      <p role="status" className="sr-only">
        Loading your dashboard
      </p>

      <div className="welcome">
        <Skeleton width={240} height={32} />
        <Skeleton width={140} height={16} />
      </div>

      <div className="balance-hero">
        <div className="balance-hero__skeleton">
          <Skeleton width={120} height={14} />
          <Skeleton width={220} height={40} />
          <Skeleton width={160} height={14} />
        </div>
      </div>

      <section>
        <h2 className="section-title">Accounts</h2>
        <div className="account-list">
          {[0, 1, 2].map((index) => (
            <Card key={index} className="account-card">
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={14} />
              <Skeleton width="70%" height={28} />
            </Card>
          ))}
        </div>
      </section>

      <div className="rail">
        <Card>
          <div className="card__body daily-limit">
            <Skeleton width={100} height={16} />
            <Skeleton width="80%" height={24} />
            <Skeleton height={8} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="card__header">
          <Skeleton width={200} height={24} />
        </div>
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="txn-skeleton-row">
            <Skeleton width="45%" height={16} />
            <Skeleton width={90} height={16} />
          </div>
        ))}
      </Card>
    </div>
  )
}
