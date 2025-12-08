"use client"

import { Calendar } from "lucide-react"
import { useFormContext } from "react-hook-form"

export default function StepOne() {
  const {register, formState: { errors }} = useFormContext<{ title: string; startDate: string; endDate: string }>();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Trip Information</h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              {...register("title")} // Zodで管理するため register のみ
              className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-input"
              }`}
            />
            {/* エラー表示 */}
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title.message as string}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate")}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.startDate ? "border-red-500 focus:ring-red-500" : "border-input"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate.message as string}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                End Date
              </label>
              <input
                type="date"
                {...register("endDate")}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                   errors.endDate ? "border-red-500 focus:ring-red-500" : "border-input"
                }`}
              />
               {errors.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate.message as string}</p>
              )}
            </div>
          </div>

          {/* Trip Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Trip Description</label>
            <textarea
              placeholder="Tell us about your trip..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Tip:</span> You can add and update places and photos in the next steps.
        </p>
      </div>
    </div>
  )
}
