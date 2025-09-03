<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { callSpotifyApi } from '$lib/spotify';
	import { Music, User, Users, TrendingUp, LogOut } from '@lucide/svelte';

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
	import TrackCard from '$lib/components/TrackCard.svelte';

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

	// Polling control
	let pollingInterval: number | null = null;

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const code = urlParams.get('code');

		if (code) {
			getToken(code);
		} else if (localStorage.getItem('access_token')) {
			isLoggedIn = true;
			// If logged in, start fetching data immediately
			fetchAllData();
			// Start polling for now playing updates
			startNowPlayingPolling();
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
			// Debug: Log first few artists to see genre data
			console.log(
				'Top artists with genres:',
				topArtists.slice(0, 3).map((artist: any) => ({
					name: artist.name,
					genres: artist.genres,
					hasGenres: artist.genres && artist.genres.length > 0
				}))
			);
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
			// If it's an auth error, stop polling to prevent spam
			if (error instanceof Error && error.message.includes('Authentication failed')) {
				stopNowPlayingPolling();
				isLoggedIn = false;
			}
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

	function logout() {
		// Stop polling
		stopNowPlayingPolling();

		// Clear all stored data
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('code_verifier');

		// Reset state
		isLoggedIn = false;
		userProfile = null;
		topArtists = [];
		topTracks = [];
		currentlyPlaying = null;
		recentlyPlayed = [];
		playlists = [];
		followedArtists = [];
		savedAlbums = [];
		savedTracks = [];
		devices = [];

		// Reset pagination
		savedTracksOffset = 0;
		hasMoreSavedTracks = true;

		// Reset active section
		activeSection = 'overview';
	}

	// A robust polling function using setInterval for better control
	function startNowPlayingPolling() {
		// Clear any existing interval
		if (pollingInterval) {
			clearInterval(pollingInterval);
		}

		// Start new interval
		pollingInterval = setInterval(async () => {
			await fetchNowPlaying();
		}, 1000); // Poll every 1 second for real-time updates
	}

	function stopNowPlayingPolling() {
		if (pollingInterval) {
			clearInterval(pollingInterval);
			pollingInterval = null;
		}
	}

	// Cleanup on component destroy
	onDestroy(() => {
		stopNowPlayingPolling();
	});

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
			startNowPlayingPolling(); // Start polling
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

<!-- Pulsing Background -->
<div aria-hidden="true" class="fixed inset-0 -z-10">
	<div
		class="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(94,234,212,0.06),rgba(11,15,20,0))]"
	></div>
	<div
		class="animate-pulsegrid absolute inset-0 [background-image:linear-gradient(transparent,transparent),linear-gradient(#111827_1px,transparent_1px),linear-gradient(90deg,#111827_1px,transparent_1px)] bg-[length:100%_100%,32px_32px,32px_32px] opacity-30"
	></div>
</div>

<!-- Top Bar -->
<header class="bg-canvas/80 sticky top-0 z-30 border-b border-white/5 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
		<div class="flex items-center gap-2">
			<div
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500"
			>
				<Music class="h-4 w-4 text-white" />
			</div>
			<span class="font-semibold text-white">Spotify Stats</span>
		</div>
		<div class="ml-auto flex items-center gap-4 text-sm text-white/60">
			{#if isLoggedIn}
				<span class="inline-flex items-center gap-2">
					<span class="inline-flex size-1.5 animate-ping rounded-full bg-emerald-400"></span>
					Connected to Spotify
				</span>
				<button
					on:click={logout}
					class="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
					title="Logout from Spotify"
				>
					<LogOut class="h-4 w-4" />
					Logout
				</button>
			{:else}
				<span>Connect to see your stats</span>
			{/if}
		</div>
	</div>
</header>

<main class="bg-canvas min-h-screen text-white selection:bg-teal-300/20 selection:text-teal-200">
	{#if !isLoggedIn}
		<!-- Hero Section -->
		<section class="mx-auto max-w-6xl px-4 py-20">
			<div class="text-center">
				<div
					class="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
				>
					<span class="inline-flex size-1.5 animate-ping rounded-full bg-emerald-400"></span>
					Spotify Web API Integration
				</div>
				<h1 class="mb-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl">
					Your <span
						class="bg-gradient-to-r from-emerald-300 to-teal-400 bg-clip-text text-transparent"
						>Spotify</span
					>
					Stats
					<br />Dashboard
				</h1>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-white/70">
					Discover your music listening patterns with a comprehensive dashboard that shows your top
					tracks, artists, recently played music, and much more.
				</p>
				<button
					on:click={redirectToSpotifyLogin}
					class="shadow-glow inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-6 py-3 font-medium transition-all duration-300 hover:bg-emerald-400/20"
				>
					<Music class="h-5 w-5" />
					Connect with Spotify
				</button>
			</div>
		</section>
	{:else}
		<div class="mx-auto max-w-6xl space-y-8 px-4 py-8">
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
						<section>
							<div class="mb-6 flex items-end justify-between gap-4">
								<h2 class="text-2xl font-bold sm:text-3xl">Top Artists</h2>
								<button
									on:click={() => handleSectionChange('top-artists')}
									class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
								>
									View All
								</button>
							</div>
							<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
								{#each topArtists.slice(0, 10) as artist}
									<article
										class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
										style="transform-style: preserve-3d;"
										on:mouseenter={(e) => {
											const card = e.currentTarget;
											card.style.transition = 'transform 0.1s ease-out';
										}}
										on:mouseleave={(e) => {
											const card = e.currentTarget;
											card.style.transition = 'transform 0.3s ease-out';
											card.style.transform =
												'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
										}}
										on:mousemove={(e) => {
											const card = e.currentTarget;
											const rect = card.getBoundingClientRect();
											const centerX = rect.left + rect.width / 2;
											const centerY = rect.top + rect.height / 2;

											const mouseX = e.clientX - centerX;
											const mouseY = e.clientY - centerY;

											const rotateX = (mouseY / rect.height) * -20;
											const rotateY = (mouseX / rect.width) * 20;

											card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
										}}
									>
										<div class="aspect-square p-4">
											{#if artist.images && artist.images.length > 0}
												<img
													src={artist.images[0].url}
													alt={artist.name}
													class="h-full w-full rounded-xl object-cover"
												/>
											{:else}
												<div
													class="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50"
												>
													<User class="h-8 w-8 text-white/40" />
												</div>
											{/if}
										</div>
										<div class="p-3">
											<h3 class="truncate text-sm font-semibold">{artist.name}</h3>
											{#if artist.genres && artist.genres.length > 0}
												<p class="mt-1 truncate text-xs text-white/60 capitalize">
													{artist.genres[0]}
												</p>
											{:else}
												<p class="mt-1 truncate text-xs text-white/60">Artist</p>
											{/if}
											<div class="mt-1 flex items-center justify-between text-xs text-white/50">
												<div class="flex items-center gap-1">
													<Users class="h-3 w-3" />
													<span>{formatNumber(artist.followers?.total || 0)}</span>
												</div>
												{#if artist.popularity}
													<div class="flex items-center gap-1">
														<TrendingUp class="h-3 w-3" />
														<span>{artist.popularity}%</span>
													</div>
												{/if}
											</div>
										</div>
									</article>
								{/each}
							</div>
						</section>
					{/if}

					<!-- Top Tracks Overview -->
					{#if topTracks.length > 0}
						<section>
							<div class="mb-6 flex items-end justify-between gap-4">
								<h2 class="text-2xl font-bold sm:text-3xl">Top Tracks</h2>
								<button
									on:click={() => handleSectionChange('top-tracks')}
									class="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
								>
									View All
								</button>
							</div>
							<div class="space-y-3">
								{#each topTracks.slice(0, 5) as track, index}
									<TrackCard
										{track}
										{index}
										showRanking={true}
										showAlbum={false}
										showDuration={true}
										showPopularity={false}
									/>
								{/each}
							</div>
						</section>
					{/if}
				</div>
			{:else if activeSection === 'top-tracks'}
				<TopTracks {topTracks} />
			{:else if activeSection === 'top-artists'}
				<div class="space-y-6">
					<h2 class="text-2xl font-bold sm:text-3xl">Your Top Artists</h2>
					<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
						{#each topArtists as artist}
							<article
								class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
								style="transform-style: preserve-3d;"
								on:mouseenter={(e) => {
									const card = e.currentTarget;
									card.style.transition = 'transform 0.1s ease-out';
								}}
								on:mouseleave={(e) => {
									const card = e.currentTarget;
									card.style.transition = 'transform 0.3s ease-out';
									card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
								}}
								on:mousemove={(e) => {
									const card = e.currentTarget;
									const rect = card.getBoundingClientRect();
									const centerX = rect.left + rect.width / 2;
									const centerY = rect.top + rect.height / 2;

									const mouseX = e.clientX - centerX;
									const mouseY = e.clientY - centerY;

									const rotateX = (mouseY / rect.height) * -20;
									const rotateY = (mouseX / rect.width) * 20;

									card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
								}}
							>
								<div class="aspect-square p-4">
									{#if artist.images && artist.images.length > 0}
										<img
											src={artist.images[0].url}
											alt={artist.name}
											class="h-full w-full rounded-xl object-cover"
										/>
									{:else}
										<div
											class="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50"
										>
											<i data-lucide="user" class="h-8 w-8 text-white/40"></i>
										</div>
									{/if}
								</div>
								<div class="p-3">
									<h3 class="truncate text-sm font-semibold">{artist.name}</h3>
									{#if artist.genres && artist.genres.length > 0}
										<p class="mt-1 truncate text-xs text-white/60 capitalize">{artist.genres[0]}</p>
									{:else}
										<p class="mt-1 truncate text-xs text-white/60">Artist</p>
									{/if}
									<div class="mt-1 flex items-center justify-between text-xs text-white/50">
										<div class="flex items-center gap-1">
											<Users class="h-3 w-3" />
											<span>{formatNumber(artist.followers?.total || 0)}</span>
										</div>
										{#if artist.popularity}
											<div class="flex items-center gap-1">
												<TrendingUp class="h-3 w-3" />
												<span>{artist.popularity}%</span>
											</div>
										{/if}
									</div>
								</div>
							</article>
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
				<SavedTracks {savedTracks} hasMore={hasMoreSavedTracks} onLoadMore={loadMoreSavedTracks} />
			{:else if activeSection === 'devices'}
				<DevicesInfo {devices} />
			{/if}
		</div>
	{/if}
</main>
