const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

async function refreshAccessToken(): Promise<string> {
	const refreshToken = localStorage.getItem('refresh_token');

	if (!refreshToken) {
		throw new Error('No refresh token available');
	}

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: clientId
		})
	});

	if (!response.ok) {
		throw new Error('Failed to refresh access token');
	}

	const data = await response.json();

	// Update the stored tokens
	localStorage.setItem('access_token', data.access_token);
	if (data.refresh_token) {
		localStorage.setItem('refresh_token', data.refresh_token);
	}

	return data.access_token;
}

export async function callSpotifyApi(endpoint: string) {
	let accessToken = localStorage.getItem('access_token');

	const makeRequest = async (token: string) => {
		const response = await fetch(SPOTIFY_API_BASE + endpoint, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response;
	};

	let response = await makeRequest(accessToken);

	// If we get a 401, try to refresh the token and retry
	if (response.status === 401) {
		try {
			accessToken = await refreshAccessToken();
			response = await makeRequest(accessToken);
		} catch (error) {
			console.error('Token refresh failed:', error);
			// If refresh fails, redirect to login
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/';
			throw new Error('Authentication failed. Please log in again.');
		}
	}

	if (!response.ok) {
		console.error('API call failed:', response);
		throw new Error(`Spotify API request failed with status ${response.status}`);
	}

	if (response.status === 204) {
		return null;
	}

	return await response.json();
}
