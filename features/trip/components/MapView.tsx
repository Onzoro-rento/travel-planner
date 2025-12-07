'use client'

import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps"
import { useEffect, useState } from "react"

export default function MapView() {
  const [currentPos, setCurrentPos] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPosition: { lat: number; lng: number } = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        console.log('現在地を取得しました:', newPosition)
        setCurrentPos(newPosition)
      },
      (err) => {
        console.error('位置情報の取得に失敗:', err)
        // デフォルト位置（東京）を設定
        setCurrentPos({ lat: 35.6762, lng: 139.6503 })
      }
    )
  }, [])

  if (!currentPos) return <p>現在地を取得中...</p>

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{ width: "100%", height: "500px" }}
        defaultCenter={currentPos}
        defaultZoom={14}
        mapId="travel-planner-map"
        disableDefaultUI={true}
        gestureHandling="greedy"
      >
        <AdvancedMarker position={currentPos}>
          <Pin background="#0d9488" glyphColor="#fff" borderColor="#0f766e" />
        </AdvancedMarker>
      </Map>
    </APIProvider>
  )
}
