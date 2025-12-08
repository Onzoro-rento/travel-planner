import {z} from "zod";

export const step1Schema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  startDate: z.string().min(1, "開始日は必須です"),
  endDate: z.string().min(1, "終了日は必須です"),
});

// PlaceDataの型定義
export const placeDataSchema = z.object({
  name: z.string(),
  googlePlaceId: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string().optional(),
});

export const step2Schema = z.object({
  places: z.array(placeDataSchema).min(1, "少なくとも1つの場所を追加してください"),
});

export const step3Schema = z.object({
  shareWithFriends: z.boolean(),
  syncCalendar: z.boolean(),
});

export const tripSchema = step1Schema.merge(step2Schema).merge(step3Schema);
export type TripSchemaType = z.infer<typeof tripSchema>;
export type PlaceDataType = z.infer<typeof placeDataSchema>;