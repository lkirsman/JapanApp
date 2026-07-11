// Build a Google Maps link for a place. On phones this opens the Google Maps
// app straight to a search for the place, from which "Directions" is one tap.
// Places store a name + optional address (no coordinates), so we search by text.
export function placeMapsUrl(name: string, address?: string | null): string {
  const parts = [name, address ?? ''].map((s) => s.trim()).filter(Boolean)
  let query = parts.join(', ')
  if (!/japan/i.test(query)) query += ', Japan'
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Link to a lat/lng point (used for zones, which have coordinates).
export function coordMapsUrl(lat: number, lng: number, label?: string): string {
  const q = label ? `${encodeURIComponent(label)}@${lat},${lng}` : `${lat},${lng}`
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}
