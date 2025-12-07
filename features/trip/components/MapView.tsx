'use client'

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"

export default function MapView() {
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // オプションを追加して精度を上げる
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setCurrentPos(newPosition)
      },
      (err) => {
        console.error('位置情報の取得に失敗:', err)
        setCurrentPos({ lat: 35.6762, lng: 139.6503 }) // 東京
      }
    )
  }, [])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <p>APIキー設定エラー</p>;
  }

  // 位置情報取得中はローディングを表示（これでMapの初期化を遅らせる）
  if (!currentPos) return <p>現在地を取得中...</p>

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        style={{ width: "100%", height: "500px" }}
        defaultCenter={currentPos}
        defaultZoom={14}
        mapId="travel-planner-map"
        disableDefaultUI={true}
        gestureHandling="greedy"
        key={`${currentPos.lat}-${currentPos.lng}`} // keyを変えると強制的に再作成される
      >
        <AdvancedMarker position={currentPos}>
          <Pin background="#0d9488" glyphColor="#fff" borderColor="#0f766e" />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  )
}