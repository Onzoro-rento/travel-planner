"use client"
import { MapPin, Trash2, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useMapsLibrary } from "@vis.gl/react-google-maps"
import { PlaceDataType } from "../../schema/tripSchema"
type PlaceData = PlaceDataType;


export default function StepTwo() {
  const { watch, setValue, formState: { errors } } = useFormContext<{ places: PlaceData[] }>();
  const places = watch("places") || [];

  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<google.maps.places.Place[]>([])
  const [isLoading, setIsLoading] = useState(false);
  
  const placesLib = useMapsLibrary("places")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (!placesLib || !searchQuery) return;

    const timerId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const { places: searchResults } = await google.maps.places.Place.searchByText({
          textQuery: searchQuery,
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          isOpenNow: false, 
        });

        if (searchResults && searchResults.length > 0) {
          setSuggestions(searchResults);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Search failed:", error); // エラーログを確認してください！
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchQuery, placesLib]); // places はここには含めない！

  // 場所を選択した時の処理
  const handleSelectPlace = (place: google.maps.places.Place) => {
    const location = place.location;
    
    if (place.id && location && place.displayName) {
      const newPlace: PlaceData = {
        name: place.displayName,
        googlePlaceId: place.id,
        latitude: location.lat(),
        longitude: location.lng(),
        address: place.formattedAddress || "",
      };
      console.log("Selected Place:", newPlace);

      setValue("places", [...places, newPlace], { shouldValidate: true, shouldDirty: true });
      setSearchQuery("");
      setSuggestions([]);
    }
  };

  const handleRemovePlace = (placeId: string) => {
    const updatedPlaces = places.filter((p) => p.googlePlaceId !== placeId);
    setValue("places", updatedPlaces, { shouldValidate: true, shouldDirty: true });
  };

  // 【重要】フィルタリングはここ（描画時）で行う
  // 既に登録済みの場所は候補リストから除外する
  const filteredSuggestions = suggestions.filter(
    (s) => !places.some((p) => p.googlePlaceId === s.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Add Places</h2>
        <p className="text-muted-foreground mb-6">Search and add the places you visited or plan to visit</p>

        {/* Search Box */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search for places (e.g., 'Tokyo Tower')..."
            value={searchQuery}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
               <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {filteredSuggestions.map((place) => (
                <button
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0 flex items-center gap-3"
                >
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <span className="text-foreground font-medium block">{place.displayName}</span>
                    <span className="text-xs text-muted-foreground block">{place.formattedAddress}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {errors.places && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium">
             ⚠️ {errors.places.message as string}
          </div>
        )}

        {/* Added Places List */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Places Added ({places.length})</h3>
          <div className="space-y-2">
            {places.length === 0 ? (
              <div className="p-6 text-center bg-muted rounded-lg">
                <p className="text-muted-foreground">No places added yet. Search above to get started!</p>
              </div>
            ) : (
              places.map((place, idx) => (
                <div
                  key={place.googlePlaceId}
                  className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{place.name}</p>
                      <p className="text-xs text-muted-foreground">{place.address}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlace(place.googlePlaceId)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}