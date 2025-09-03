const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export async function callSpotifyApi(endpoint: string) {
	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(SPOTIFY_API_BASE + endpoint, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		console.error('API call failed:', response);
		throw new Error(`Spotify API request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	return await response.json();
}