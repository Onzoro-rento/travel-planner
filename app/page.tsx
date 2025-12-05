import { MapPin } from 'lucide-react'

export default async function HomePage() {
  const sampleTrips = [
    { id: 1, name: 'Tokyo', color: 'bg-red-400' },
    { id: 2, name: 'Paris', color: 'bg-blue-400' },
    { id: 3, name: 'Bali', color: 'bg-pink-400' },
    { id: 4, name: 'New York', color: 'bg-purple-400' },
  ]


  return (
    <>
          <div className="max-w-7xl mx-auto p-4 lg:p-8">
            {/* モバイル用検索バー */}
            <div className="lg:hidden mb-6">
              <input
                type="text"
                placeholder="Search trips..."
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              />
            </div>


            {/* マップ統合エリア */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-700 mb-3">
                  Map Integration Area
                </h2>
                <p className="text-gray-500">
                  Google Maps component will be rendered here
                </p>
              </div>

              {/* サンプル旅行先カード */}
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {sampleTrips.map((trip) => (
                  <button
                    key={trip.id}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all group"
                  >
                    <MapPin className={`w-5 h-5 text-white ${trip.color} rounded-full p-1`} />
                    <span className="font-medium text-gray-800 group-hover:text-gray-900">
                      {trip.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* モバイル用のナビゲーションヒント */}
            <div className="lg:hidden mt-6 p-4 bg-teal-50 rounded-xl border border-teal-100">
              <p className="text-sm text-teal-800 text-center">
                👉 Use the sidebar menu to navigate between trips, create new ones, and more
              </p>
            </div>
          </div>
    </>
  )
}