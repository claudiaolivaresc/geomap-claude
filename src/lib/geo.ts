const R = 6371000; // Earth radius in meters
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Haversine distance between two points, returns meters */
export function haversineDistance(
  lng1: number,
  lat1: number,
  lng2: number,
  lat2: number,
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Spherical excess formula for polygon area on a sphere, returns m² */
export function sphericalPolygonArea(
  points: { lng: number; lat: number }[],
): number {
  if (points.length < 3) return 0;
  let total = 0;
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const k = (i + 2) % n;
    total +=
      (toRad(points[k].lng) - toRad(points[i].lng)) *
      Math.sin(toRad(points[j].lat));
  }
  return Math.abs((total * R * R) / 2);
}

/** Format distance: meters for <1000, km otherwise */
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(2)} km`;
}

/** Format area: m² for <1e6, km² otherwise */
export function formatArea(sqMeters: number): string {
  if (sqMeters < 1_000_000)
    return `${Math.round(sqMeters).toLocaleString()} m\u00B2`;
  return `${(sqMeters / 1_000_000).toFixed(2)} km\u00B2`;
}
