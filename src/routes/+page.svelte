<script lang="ts">
	import { onMount } from 'svelte';
	import { callSpotifyApi } from '$lib/spotify';
	import NowPlaying from '$lib/components/NowPlaying.svelte'; // Import the new component

	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = 'http://127.0.0.1:5173';

	let isLoggedIn = false;
	let topArtists: any = [];
	let currentlyPlaying: any = null; // State for the currently playing track

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			getToken(code);
		} else if (localStorage.getItem('access_token')) {
			isLoggedIn = true;
			// If logged in, start fetching data immediately
			fetchAllData();
		}
	});

	async function fetchAllData() {
		await Promise.all([fetchTopArtists(), fetchNowPlaying()]);
	}

	async function fetchTopArtists() {
		try {
			const data = await callSpotifyApi('/me/top/artists?time_range=long_term&limit=10');
			topArtists = data.items;
		} catch (error) {
			console.error('Failed to fetch top artists:', error);
		}
	}

	async function fetchNowPlaying() {
		try {
			// Call the /me/player/currently-playing endpoint [1]
			const data = await callSpotifyApi('/me/player/currently-playing');
			currentlyPlaying = data;
		} catch (error) {
			console.error('Failed to fetch now playing:', error);
		}
	}

	// A robust polling function using recursive setTimeout
	async function pollNowPlaying() {
		await fetchNowPlaying();
		setTimeout(pollNowPlaying, 5000); // Poll every 5 seconds
	}

	// --- All the authentication functions from before remain the same ---

	async function redirectToSpotifyLogin() {
		const codeVerifier = generateRandomString(64);
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		window.localStorage.setItem('code_verifier', codeVerifier);
		const authUrl = new URL('https://accounts.spotify.com/authorize');
		const params = {
			response_type: 'code',
			client_id: clientId,
			scope:
				'user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing',
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
			console.error('Code verifier not found.');
			return;
		}
		const url = 'https://accounts.spotify.com/api/token';
		const payload = {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
			if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
			const tokenData = await response.json();
			localStorage.setItem('access_token', tokenData.access_token);
			localStorage.setItem('refresh_token', tokenData.refresh_token);
			isLoggedIn = true;
			window.history.pushState({}, '', redirectUri);
			fetchAllData(); // Fetch data right after logging in
			pollNowPlaying(); // Start polling
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

<main class="bg-gray-900 text-white min-h-screen flex flex-col items-center p-8 space-y-12">
	{#if !isLoggedIn}
		<div class="text-center my-auto">
			<h1 class="text-5xl font-bold mb-4">Spotify Stats Fetcher</h1>
			<p class="text-lg text-gray-400 mb-8">Log in to see your personal listening stats.</p>
			<button
				on:click={redirectToSpotifyLogin}
				class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
			>
				Log in with Spotify
			</button>
		</div>
	{:else}
		<NowPlaying {currentlyPlaying} />

		<div class="w-full max-w-4xl mx-auto">
			<h2 class="text-3xl font-bold mb-6 text-center">Your Top Artists</h2>
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
				{#each topArtists as artist}
					<div class="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition">
						{#if artist.images.length > 0}
							<img
								src={artist.images.url}
								alt={artist.name}
								class="w-full h-auto rounded-full aspect-square object-cover mx-auto mb-4"
							/>
						{/if}
						<p class="font-semibold truncate">{artist.name}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</main>