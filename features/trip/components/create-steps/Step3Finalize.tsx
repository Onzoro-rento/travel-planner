"use client"

import { Share2, Calendar, CheckCircle } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { PlaceDataType } from "../../schema/tripSchema"
export default function StepThree() {
  // registerを使うことで、setValueやonChangeを自作する必要がなくなります
  const { watch, register } = useFormContext<{
    title: string;
    startDate: string;
    endDate: string;
    places: PlaceDataType[];
    shareWithFriends: boolean;
    syncCalendar: boolean;
  }>();

  const formData = watch();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Finalize Your Plan</h2>

        {/* Summary Card */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <CheckCircle className="w-6 h-6 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Trip Title</p>
              <p className="font-semibold text-foreground">{formData.title || "Untitled Trip"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Calendar className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold text-foreground">
                {formData.startDate} to {formData.endDate}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-lg">📍</div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-2">Places ({formData.places?.length || 0})</p>
              <div className="space-y-1">
                {formData.places && formData.places.length > 0 ? (
                  formData.places.map((place: PlaceDataType, idx: number) => (
                    <p key={idx} className="text-sm text-foreground">
                      {idx + 1}. {place.name}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No places added</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sharing Options */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-foreground mb-3">Sharing Options</h3>

          {/* Share with Friends */}
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              {...register("shareWithFriends")} // シンプルに register
              className="w-5 h-5 rounded border-input accent-primary"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground">Share with Friends</p>
              <p className="text-xs text-muted-foreground">Let your friends see and comment on your trip</p>
            </div>
            <Share2 className="w-5 h-5 text-primary" />
          </label>

          {/* Sync with Google Calendar */}
          <label className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <input
              type="checkbox"
              {...register("syncCalendar")} // シンプルに register
              className="w-5 h-5 rounded border-input accent-primary"
            />
            <div className="flex-1">
              <p className="font-medium text-foreground">Sync with Google Calendar</p>
              <p className="text-xs text-muted-foreground">Automatically add your trip to your calendar</p>
            </div>
            <Calendar className="w-5 h-5 text-primary" />
          </label>
        </div>

      </div>
    </div>
  )
}