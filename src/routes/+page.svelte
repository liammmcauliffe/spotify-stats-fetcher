<script lang="ts">
	import { onMount } from 'svelte';
	import { callSpotifyApi } from '$lib/spotify';
	import NowPlaying from '$lib/components/NowPlaying.svelte';
	import UserProfile from '$lib/components/UserProfile.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import TopTracks from '$lib/components/TopTracks.svelte';
	import RecentlyPlayed from '$lib/components/RecentlyPlayed.svelte';
	import SavedPlaylists from '$lib/components/SavedPlaylists.svelte';
	import FollowedArtists from '$lib/components/FollowedArtists.svelte';
	import SavedAlbums from '$lib/components/SavedAlbums.svelte';
	import SavedTracks from '$lib/components/SavedTracks.svelte';
	import DevicesInfo from '$lib/components/DevicesInfo.svelte';

	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = 'http://127.0.0.1:5173';

	let isLoggedIn = false;
	let activeSection = 'overview';

	// Data state
	let userProfile: any = null;
	let topArtists: any = [];
	let topTracks: any = [];
	let currentlyPlaying: any = null;
	let recentlyPlayed: any = [];
	let playlists: any = [];
	let followedArtists: any = [];
	let savedAlbums: any = [];
	let savedTracks: any = [];
	let devices: any = [];

	// Pagination for saved tracks
	let savedTracksOffset = 0;
	let hasMoreSavedTracks = true;

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
		await Promise.all([
			fetchUserProfile(),
			fetchTopArtists(),
			fetchTopTracks(),
			fetchNowPlaying(),
			fetchRecentlyPlayed(),
			fetchPlaylists(),
			fetchFollowedArtists(),
			fetchSavedAlbums(),
			fetchSavedTracks(),
			fetchDevices()
		]);
	}

	async function fetchUserProfile() {
		try {
			userProfile = await callSpotifyApi('/me');
		} catch (error) {
			console.error('Failed to fetch user profile:', error);
		}
	}

	async function fetchTopArtists() {
		try {
			const data = await callSpotifyApi('/me/top/artists?time_range=long_term&limit=20');
			topArtists = data.items;
		} catch (error) {
			console.error('Failed to fetch top artists:', error);
		}
	}

	async function fetchTopTracks() {
		try {
			const data = await callSpotifyApi('/me/top/tracks?time_range=long_term&limit=20');
			topTracks = data.items;
		} catch (error) {
			console.error('Failed to fetch top tracks:', error);
		}
	}

	async function fetchNowPlaying() {
		try {
			const data = await callSpotifyApi('/me/player/currently-playing');
			currentlyPlaying = data;
		} catch (error) {
			console.error('Failed to fetch now playing:', error);
		}
	}

	async function fetchRecentlyPlayed() {
		try {
			const data = await callSpotifyApi('/me/player/recently-played?limit=50');
			recentlyPlayed = data.items;
		} catch (error) {
			console.error('Failed to fetch recently played:', error);
		}
	}

	async function fetchPlaylists() {
		try {
			const data = await callSpotifyApi('/me/playlists?limit=50');
			playlists = data.items;
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
		}
	}

	async function fetchFollowedArtists() {
		try {
			const data = await callSpotifyApi('/me/following?type=artist&limit=50');
			followedArtists = data.artists.items;
		} catch (error) {
			console.error('Failed to fetch followed artists:', error);
		}
	}

	async function fetchSavedAlbums() {
		try {
			const data = await callSpotifyApi('/me/albums?limit=50');
			savedAlbums = data.items;
		} catch (error) {
			console.error('Failed to fetch saved albums:', error);
		}
	}

	async function fetchSavedTracks() {
		try {
			const data = await callSpotifyApi('/me/tracks?limit=50&offset=0');
			savedTracks = data.items;
			savedTracksOffset = 50;
			hasMoreSavedTracks = data.total > 50;
		} catch (error) {
			console.error('Failed to fetch saved tracks:', error);
		}
	}

	async function loadMoreSavedTracks() {
		try {
			const data = await callSpotifyApi(`/me/tracks?limit=50&offset=${savedTracksOffset}`);
			savedTracks = [...savedTracks, ...data.items];
			savedTracksOffset += 50;
			hasMoreSavedTracks = savedTracks.length < data.total;
		} catch (error) {
			console.error('Failed to load more saved tracks:', error);
		}
	}

	async function fetchDevices() {
		try {
			const data = await callSpotifyApi('/me/player/devices');
			devices = data.devices;
		} catch (error) {
			console.error('Failed to fetch devices:', error);
		}
	}

	function handleSectionChange(section: string) {
		activeSection = section;
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
				'user-read-private user-read-email user-top-read user-read-recently-played user-read-currently-playing user-read-playback-state playlist-read-private playlist-read-collaborative user-follow-read user-library-read',
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

<main class="flex min-h-screen flex-col items-center space-y-12 bg-gray-900 p-8 text-white">
	{#if !isLoggedIn}
		<div class="my-auto text-center">
			<h1 class="mb-4 text-5xl font-bold">Spotify Stats Fetcher</h1>
			<p class="mb-8 text-lg text-gray-400">Log in to see your personal listening stats.</p>
			<button
				on:click={redirectToSpotifyLogin}
				class="rounded-full bg-green-500 px-8 py-3 text-lg font-bold text-white transition duration-300 hover:bg-green-600"
			>
				Log in with Spotify
			</button>
		</div>
	{:else}
		<div class="mx-auto w-full max-w-7xl space-y-8">
			<!-- User Profile Header -->
			<UserProfile {userProfile} />

			<!-- Now Playing Widget -->
			<NowPlaying {currentlyPlaying} />

			<!-- Navigation -->
			<Navigation {activeSection} onSectionChange={handleSectionChange} />

			<!-- Content Sections -->
			{#if activeSection === 'overview'}
				<div class="space-y-12">
					<!-- Top Artists Overview -->
					{#if topArtists.length > 0}
						<div class="mx-auto w-full max-w-6xl">
							<h2 class="mb-6 text-center text-3xl font-bold">Your Top Artists</h2>
							<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
								{#each topArtists.slice(0, 10) as artist}
									<div class="rounded-lg bg-gray-800 p-4 text-center transition hover:bg-gray-700">
										{#if artist.images && artist.images.length > 0}
											<img
												src={artist.images[0].url}
												alt={artist.name}
												class="mx-auto mb-4 aspect-square h-auto w-full rounded-full object-cover"
											/>
										{/if}
										<p class="truncate font-semibold">{artist.name}</p>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Top Tracks Overview -->
					{#if topTracks.length > 0}
						<div class="mx-auto w-full max-w-6xl">
							<h2 class="mb-6 text-center text-3xl font-bold">Your Top Tracks</h2>
							<div class="grid gap-4">
								{#each topTracks.slice(0, 5) as track, index}
									<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
										<div class="flex items-center space-x-4">
											<div class="w-8 flex-shrink-0 text-center">
												<span class="text-2xl font-bold text-green-400">#{index + 1}</span>
											</div>

											{#if track.album.images && track.album.images.length > 0}
												<img
													src={track.album.images[0].url}
													alt={track.album.name}
													class="h-16 w-16 flex-shrink-0 rounded-md object-cover"
												/>
											{/if}

											<div class="min-w-0 flex-1">
												<h3 class="truncate text-lg font-semibold text-white">{track.name}</h3>
												<p class="truncate text-gray-400">
													{track.artists.map((artist: any) => artist.name).join(', ')}
												</p>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else if activeSection === 'top-tracks'}
				<TopTracks {topTracks} />
			{:else if activeSection === 'top-artists'}
				<div class="mx-auto w-full max-w-6xl">
					<h2 class="mb-6 text-center text-3xl font-bold">Your Top Artists</h2>
					<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
						{#each topArtists as artist}
							<div class="rounded-lg bg-gray-800 p-4 text-center transition hover:bg-gray-700">
								{#if artist.images && artist.images.length > 0}
									<img
										src={artist.images[0].url}
										alt={artist.name}
										class="mx-auto mb-4 aspect-square h-auto w-full rounded-full object-cover"
									/>
								{/if}
								<p class="truncate font-semibold">{artist.name}</p>
							</div>
						{/each}
					</div>
				</div>
			{:else if activeSection === 'recently-played'}
				<RecentlyPlayed {recentlyPlayed} />
			{:else if activeSection === 'playlists'}
				<SavedPlaylists {playlists} />
			{:else if activeSection === 'followed-artists'}
				<FollowedArtists {followedArtists} />
			{:else if activeSection === 'saved-albums'}
				<SavedAlbums {savedAlbums} />
			{:else if activeSection === 'saved-tracks'}
				<SavedTracks {savedTracks} {hasMoreSavedTracks} onLoadMore={loadMoreSavedTracks} />
			{:else if activeSection === 'devices'}
				<DevicesInfo {devices} />
			{/if}
		</div>
	{/if}
</main>
