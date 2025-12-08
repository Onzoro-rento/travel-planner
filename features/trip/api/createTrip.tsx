"use server"

import prisma from "@/lib/prisma"
import { tripSchema, TripSchemaType } from "../schema/tripSchema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"
import { revalidatePath } from "next/cache"

export async function createTrip(formData: TripSchemaType) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return { success: false, error: "ログインが必要です" };
    }

    const isValid = tripSchema.safeParse(formData);
    if (!isValid.success) {
        console.error("Validation error:", isValid.error);
        return {success:false,error: isValid.error}
    }
    
    const safeData = isValid.data;
    let createdTripId = "";
    try {
        const newTrip = await prisma.trip.create({
            data: {
                title: safeData.title,
                startDate: new Date(safeData.startDate),
                endDate: new Date(safeData.endDate),
                isShared: safeData.shareWithFriends,
                status: "PLANNING",
                createdBy: session.user.id,
                // 作成者をTripMemberとして追加 (adminロール)
                members: {
                    create: {
                        userId: session.user.id,
                        role: "admin",
                    }
                },
                places: {
          create: safeData.places.map((place, index) => ({
            name: place.name,
            googlePlaceId: place.googlePlaceId,
            latitude: place.latitude,
            longitude: place.longitude,
            address: place.address,
            order: index, // 配列の順番をorderに保存
            createdBy: session.user.id, // Placeの作成者も記録
          }))
        }
            },
        }); 
        createdTripId = newTrip.id;
    } catch (err) {
        console.error("Database error:", err);
        return { success: false, error: "旅行プランの作成に失敗しました" };
    }
    
    // 成功時の処理
    revalidatePath("/trips");
    revalidatePath(`/trips/${createdTripId}`);
    
    return { success: true, tripId: createdTripId };
    
    return { success: true, tripId: createdTripId };
}

    