<script lang="ts">
	import { onMount } from 'svelte';

	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = 'http://127.0.0.1:5173';

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {

			getToken(code);
		}
	});

	async function redirectToSpotifyLogin() {
		const codeVerifier = generateRandomString(64);
		const codeChallenge = await generateCodeChallenge(codeVerifier);

		window.localStorage.setItem('code_verifier', codeVerifier);

		const authUrl = new URL('https://accounts.spotify.com/authorize');
		const params = {
			response_type: 'code',
			client_id: clientId,
			scope: 'user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing',
			code_challenge_method: 'S256',
			code_challenge: codeChallenge,
			redirect_uri: redirectUri
		};

		authUrl.search = new URLSearchParams(params).toString();
		window.location.href = authUrl.toString();
	}

	async function getToken(code: string) {
		const codeVerifier = localStorage.getItem('code_verifier');

		if (!codeVerifier) {
			console.error('Code verifier not found in local storage.');
			return;
		}

		const url = 'https://accounts.spotify.com/api/token';
		const payload = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: clientId,
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: redirectUri,
				code_verifier: codeVerifier
			})
		};

		try {
			const response = await fetch(url, payload);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const tokenData = await response.json();

			localStorage.setItem('access_token', tokenData.access_token);
			localStorage.setItem('refresh_token', tokenData.refresh_token);

			console.log('Successfully obtained access token:', tokenData.access_token);
			alert('You have successfully logged in!');

			window.history.pushState({}, '', redirectUri);
		} catch (error) {
			console.error('Error fetching token:', error);
		}
	}

	function generateRandomString(length: number): string {
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const values = crypto.getRandomValues(new Uint8Array(length));
		return values.reduce((acc, x) => acc + possible[x % possible.length], '');
	}

	async function generateCodeChallenge(codeVerifier: string): Promise<string> {
		const encoder = new TextEncoder();
		const data = encoder.encode(codeVerifier);
		const digest = await window.crypto.subtle.digest('SHA-256', data);

		return btoa(String.fromCharCode(...new Uint8Array(digest)))
			.replace(/=/g, '')
			.replace(/\+/g, '-')
			.replace(/\//g, '_');
	}
</script>

<main class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
	<div class="text-center">
		<h1 class="text-5xl font-bold mb-4">Spotify Stats Fetcher</h1>
		<p class="text-lg text-gray-400 mb-8">Log in to see your personal listening stats.</p>
		<button
			on:click={redirectToSpotifyLogin}
			class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
		>
			Log in with Spotify
		</button>
	</div>
</main>