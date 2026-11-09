/** Format signed decimal coordinates with explicit hemisphere labels. */
export function formatCoordinates(latitude: number, longitude: number): string {
	return `${Math.abs(latitude).toFixed(2)}°${latitude < 0 ? 'S' : 'N'} ${Math.abs(longitude).toFixed(2)}°${longitude < 0 ? 'W' : 'E'}`;
}
