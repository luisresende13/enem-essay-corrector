import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function DashboardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              <Skeleton width={300} />
            </h2>
            <div className="flex items-center gap-4">
              <Skeleton circle width={64} height={64} />
              <div className="flex-1">
                <Skeleton width={200} height={24} />
                <Skeleton width={250} height={20} className="mt-2" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton width={120} height={16} />
                    <Skeleton width={80} height={36} className="mt-2" />
                  </div>
                  <Skeleton circle width={48} height={48} />
                </div>
              </div>
            ))}
          </div>

          {/* Action Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              <Skeleton width={200} />
            </h3>
            <Skeleton count={2} className="mb-6" />
            <Skeleton width={150} height={48} />
          </div>

          {/* Essays List Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              <Skeleton width={150} />
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Skeleton width={200} height={20} />
                      <Skeleton width={150} height={16} className="mt-2" />
                    </div>
                    <Skeleton width={80} height={36} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}