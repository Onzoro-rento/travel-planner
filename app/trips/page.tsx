import MapView from "@/features/trip/components/maps/MapView"

interface PageProps {
  searchParams: Promise<{ view?: string }>
}

export default async function CreateTripPage({ searchParams }: PageProps) {
  const params = await searchParams
  const viewMode = params.view === 'list' ? 'list' : 'map'

  return (
    <div className="p-6">

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
