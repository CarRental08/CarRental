import { useState, useEffect } from "react";

const FAVORITES_KEY = "palexpress_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (vehicleId: string) => {
    setFavorites((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const isFavorite = (vehicleId: string) => favorites.includes(vehicleId);

  return { favorites, toggleFavorite, isFavorite };
}
