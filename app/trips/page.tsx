import MapView from "@/features/trip/components/MapView"

interface PageProps {
  searchParams: Promise<{ view?: string }>
}

export default async function CreateTripPage({ searchParams }: PageProps) {
  const params = await searchParams
  const viewMode = params.view === 'list' ? 'list' : 'map'

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">旅行プランを作成</h1>
        <div className="text-sm text-gray-600">
          表示モード: <span className="font-semibold">{viewMode === 'map' ? 'マップ表示' : 'リスト表示'}</span>
        </div>
      </div>

      {viewMode === 'map' ? (
        <MapView />
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <p className="text-gray-600">リスト表示の実装予定</p>
        </div>
      )}

      {/* TODO: 次：フォーム・場所追加・保存など */}
    </div>
  )
}
