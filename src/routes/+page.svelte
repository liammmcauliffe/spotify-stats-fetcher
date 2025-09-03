<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { callSpotifyApi } from '$lib/spotify';
	import { Music, User, Users, TrendingUp, LogOut, Search } from '@lucide/svelte';

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
	import LoadingStates from '$lib/components/LoadingStates.svelte';
	import ErrorState from '$lib/components/ErrorState.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import TimeRangeSelector from '$lib/components/TimeRangeSelector.svelte';

	const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
	const redirectUri = import.meta.env.PROD
		? 'https://spotify-stats-fetcher.vercel.app/'
		: 'http://127.0.0.1:5173';

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

	// Loading and error states
	let isLoading = false;
	let hasError = false;
	let errorMessage = '';
	let loadingStates: Record<string, boolean> = {
		userProfile: false,
		topArtists: false,
		topTracks: false,
		currentlyPlaying: false,
		recentlyPlayed: false,
		playlists: false,
		followedArtists: false,
		savedAlbums: false,
		savedTracks: false,
		devices: false
	};
	let errorStates: Record<string, boolean> = {
		userProfile: false,
		topArtists: false,
		topTracks: false,
		currentlyPlaying: false,
		recentlyPlayed: false,
		playlists: false,
		followedArtists: false,
		savedAlbums: false,
		savedTracks: false,
		devices: false
	};

	// Pagination for saved tracks
	let savedTracksOffset = 0;
	let hasMoreSavedTracks = true;

	// Polling control
	let pollingInterval: number | null = null;

	// Search state
	let searchQuery = '';
	let filteredData = {
		topArtists: [] as any[],
		topTracks: [] as any[],
		recentlyPlayed: [] as any[],
		playlists: [] as any[],
		followedArtists: [] as any[],
		savedAlbums: [] as any[],
		savedTracks: [] as any[]
	};

	// Time range state
	let selectedTimeRange = 'medium_term';

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
		isLoading = true;
		hasError = false;

		// Reset all loading and error states
		Object.keys(loadingStates).forEach((key: string) => {
			loadingStates[key] = true;
			errorStates[key] = false;
		});

		await Promise.all([
			fetchUserProfile(),
			fetchTopArtists(),
			fetchTopTracks(),
			fetchNowPlaying(true), // Initial load
			fetchRecentlyPlayed(),
			fetchPlaylists(),
			fetchFollowedArtists(),
			fetchSavedAlbums(),
			fetchSavedTracks(),
			fetchDevices()
		]);

		isLoading = false;
		// Initialize filtered data with all data
		applySearch();
	}

	async function fetchUserProfile() {
		try {
			loadingStates.userProfile = true;
			errorStates.userProfile = false;
			userProfile = await callSpotifyApi('/me');
		} catch (error) {
			console.error('Failed to fetch user profile:', error);
			errorStates.userProfile = true;
		} finally {
			loadingStates.userProfile = false;
		}
	}

	async function fetchTopArtists() {
		try {
			loadingStates.topArtists = true;
			errorStates.topArtists = false;
			console.log('Fetching top artists with time range:', selectedTimeRange);
			const data = await callSpotifyApi(`/me/top/artists?time_range=${selectedTimeRange}&limit=20`);
			topArtists = data.items;
			console.log('Top artists fetched:', topArtists.length, 'items');
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
			errorStates.topArtists = true;
		} finally {
			loadingStates.topArtists = false;
		}
	}

	async function fetchTopTracks() {
		try {
			loadingStates.topTracks = true;
			errorStates.topTracks = false;
			console.log('Fetching top tracks with time range:', selectedTimeRange);
			const data = await callSpotifyApi(`/me/top/tracks?time_range=${selectedTimeRange}&limit=20`);
			topTracks = data.items;
			console.log('Top tracks fetched:', topTracks.length, 'items');
		} catch (error) {
			console.error('Failed to fetch top tracks:', error);
			errorStates.topTracks = true;
		} finally {
			loadingStates.topTracks = false;
		}
	}

	async function fetchNowPlaying(isInitialLoad = false) {
		try {
			// Only show loading state on initial load, not during polling
			if (isInitialLoad) {
				loadingStates.currentlyPlaying = true;
			}
			errorStates.currentlyPlaying = false;
			const data = await callSpotifyApi('/me/player/currently-playing');
			currentlyPlaying = data;
		} catch (error) {
			console.error('Failed to fetch now playing:', error);
			errorStates.currentlyPlaying = true;
			// If it's an auth error, stop polling to prevent spam
			if (error instanceof Error && error.message.includes('Authentication failed')) {
				stopNowPlayingPolling();
				isLoggedIn = false;
			}
		} finally {
			if (isInitialLoad) {
				loadingStates.currentlyPlaying = false;
			}
		}
	}

	async function fetchRecentlyPlayed() {
		try {
			loadingStates.recentlyPlayed = true;
			errorStates.recentlyPlayed = false;
			const data = await callSpotifyApi('/me/player/recently-played?limit=50');
			recentlyPlayed = data.items;
		} catch (error) {
			console.error('Failed to fetch recently played:', error);
			errorStates.recentlyPlayed = true;
		} finally {
			loadingStates.recentlyPlayed = false;
		}
	}

	async function fetchPlaylists() {
		try {
			loadingStates.playlists = true;
			errorStates.playlists = false;
			const data = await callSpotifyApi('/me/playlists?limit=50');
			playlists = data.items;
		} catch (error) {
			console.error('Failed to fetch playlists:', error);
			errorStates.playlists = true;
		} finally {
			loadingStates.playlists = false;
		}
	}

	async function fetchFollowedArtists() {
		try {
			loadingStates.followedArtists = true;
			errorStates.followedArtists = false;
			const data = await callSpotifyApi('/me/following?type=artist&limit=50');
			followedArtists = data.artists.items;
		} catch (error) {
			console.error('Failed to fetch followed artists:', error);
			errorStates.followedArtists = true;
		} finally {
			loadingStates.followedArtists = false;
		}
	}

	async function fetchSavedAlbums() {
		try {
			loadingStates.savedAlbums = true;
			errorStates.savedAlbums = false;
			const data = await callSpotifyApi('/me/albums?limit=50');
			savedAlbums = data.items;
		} catch (error) {
			console.error('Failed to fetch saved albums:', error);
			errorStates.savedAlbums = true;
		} finally {
			loadingStates.savedAlbums = false;
		}
	}

	async function fetchSavedTracks() {
		try {
			loadingStates.savedTracks = true;
			errorStates.savedTracks = false;
			const data = await callSpotifyApi('/me/tracks?limit=50&offset=0');
			savedTracks = data.items;
			savedTracksOffset = 50;
			hasMoreSavedTracks = data.total > 50;
		} catch (error) {
			console.error('Failed to fetch saved tracks:', error);
			errorStates.savedTracks = true;
		} finally {
			loadingStates.savedTracks = false;
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
			loadingStates.devices = true;
			errorStates.devices = false;
			const data = await callSpotifyApi('/me/player/devices');
			devices = data.devices;
		} catch (error) {
			console.error('Failed to fetch devices:', error);
			errorStates.devices = true;
		} finally {
			loadingStates.devices = false;
		}
	}

	function handleSectionChange(section: string) {
		activeSection = section;
	}

	// Retry functions for error states
	function retryUserProfile() {
		fetchUserProfile();
	}

	function retryTopArtists() {
		fetchTopArtists();
	}

	function retryTopTracks() {
		fetchTopTracks();
	}

	function retryNowPlaying() {
		fetchNowPlaying(true); // Show loading state for retry
	}

	function retryRecentlyPlayed() {
		fetchRecentlyPlayed();
	}

	function retryPlaylists() {
		fetchPlaylists();
	}

	function retryFollowedArtists() {
		fetchFollowedArtists();
	}

	function retrySavedAlbums() {
		fetchSavedAlbums();
	}

	function retrySavedTracks() {
		fetchSavedTracks();
	}

	function retryDevices() {
		fetchDevices();
	}

	// Search functions
	function handleSearch(event: CustomEvent) {
		searchQuery = event.detail.query;
		applySearch();
	}

	// Time range functions
	async function handleTimeRangeChange(event: CustomEvent) {
		selectedTimeRange = event.detail.timeRange;
		console.log('Time range changed to:', selectedTimeRange);
		// Refetch top artists and tracks with new time range
		await fetchTopArtists();
		await fetchTopTracks();
		// Update filtered data after fetching new data
		applySearch();
	}

	function getCurrentSectionResults(): any[] {
		switch (activeSection) {
			case 'overview':
				return [...filteredData.topArtists, ...filteredData.topTracks];
			case 'top-tracks':
				return filteredData.topTracks;
			case 'top-artists':
				return filteredData.topArtists;
			case 'recently-played':
				return filteredData.recentlyPlayed;
			case 'playlists':
				return filteredData.playlists;
			case 'followed-artists':
				return filteredData.followedArtists;
			case 'saved-albums':
				return filteredData.savedAlbums;
			case 'saved-tracks':
				return filteredData.savedTracks;
			default:
				return [];
		}
	}

	function applySearch() {
		if (!searchQuery) {
			// No search, show all data
			filteredData = {
				topArtists,
				topTracks,
				recentlyPlayed,
				playlists,
				followedArtists,
				savedAlbums,
				savedTracks
			};
			return;
		}

		const query = searchQuery.toLowerCase();

		// Filter top artists
		filteredData.topArtists = topArtists.filter((artist: any) => {
			return (
				artist.name.toLowerCase().includes(query) ||
				(artist.genres &&
					artist.genres.some((genre: string) => genre.toLowerCase().includes(query)))
			);
		});

		// Filter top tracks
		filteredData.topTracks = topTracks.filter((track: any) => {
			return (
				track.name.toLowerCase().includes(query) ||
				track.artists.some((artist: any) => artist.name.toLowerCase().includes(query)) ||
				track.album.name.toLowerCase().includes(query)
			);
		});

		// Filter recently played
		filteredData.recentlyPlayed = recentlyPlayed.filter((item: any) => {
			const track = item.track;
			return (
				track.name.toLowerCase().includes(query) ||
				track.artists.some((artist: any) => artist.name.toLowerCase().includes(query)) ||
				track.album.name.toLowerCase().includes(query)
			);
		});

		// Filter playlists
		filteredData.playlists = playlists.filter((playlist: any) => {
			return (
				playlist.name.toLowerCase().includes(query) ||
				(playlist.description && playlist.description.toLowerCase().includes(query))
			);
		});

		// Filter followed artists
		filteredData.followedArtists = followedArtists.filter((artist: any) => {
			return (
				artist.name.toLowerCase().includes(query) ||
				(artist.genres &&
					artist.genres.some((genre: string) => genre.toLowerCase().includes(query)))
			);
		});

		// Filter saved albums
		filteredData.savedAlbums = savedAlbums.filter((albumData: any) => {
			const album = albumData.album;
			return (
				album.name.toLowerCase().includes(query) ||
				album.artists.some((artist: any) => artist.name.toLowerCase().includes(query))
			);
		});

		// Filter saved tracks
		filteredData.savedTracks = savedTracks.filter((trackData: any) => {
			const track = trackData.track;
			return (
				track.name.toLowerCase().includes(query) ||
				track.artists.some((artist: any) => artist.name.toLowerCase().includes(query)) ||
				track.album.name.toLowerCase().includes(query)
			);
		});
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
	<div class="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
		<div class="flex items-center gap-2">
			<div class="flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8">
				<img src="/favicon.png" alt="Spotify Stats" class="h-6 w-6 rounded-sm sm:h-7 sm:w-7" />
			</div>
			<span class="text-sm font-semibold text-white sm:text-base">Spotify Stats</span>
		</div>
		<div class="ml-auto flex items-center gap-2 text-xs text-white/60 sm:gap-4 sm:text-sm">
			{#if isLoggedIn}
				<span class="inline-flex items-center gap-1.5 sm:gap-2">
					<span class="inline-flex size-1.5 animate-ping rounded-full bg-emerald-400"></span>
					<span class="hidden sm:inline">Connected to Spotify</span>
					<span class="sm:hidden">Connected</span>
				</span>
				<button
					on:click={logout}
					class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-95 sm:gap-2 sm:px-3"
					title="Logout from Spotify"
				>
					<LogOut class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
					<span class="hidden sm:inline">Logout</span>
				</button>
			{:else}
				<span class="hidden sm:inline">Connect to see your stats</span>
				<span class="sm:hidden">Connect</span>
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
		<div class="mx-auto max-w-6xl space-y-6 px-3 py-6 sm:space-y-8 sm:px-4 sm:py-8">
			<!-- User Profile Header -->
			{#if loadingStates.userProfile}
				<LoadingStates type="profile" count={1} />
			{:else if errorStates.userProfile}
				<ErrorState
					showError={true}
					errorMessage="Failed to load user profile"
					onRetry={retryUserProfile}
				/>
			{:else}
				<UserProfile {userProfile} />
			{/if}

			<!-- Now Playing Widget -->
			{#if loadingStates.currentlyPlaying}
				<LoadingStates type="track" count={1} />
			{:else if errorStates.currentlyPlaying}
				<ErrorState
					showError={true}
					errorMessage="Failed to load currently playing track"
					onRetry={retryNowPlaying}
				/>
			{:else}
				<NowPlaying {currentlyPlaying} />
			{/if}

			<!-- Search Bar -->
			<SearchBar
				placeholder="Search tracks, artists, albums, playlists..."
				value={searchQuery}
				on:search={handleSearch}
			/>

			<!-- Navigation -->
			<Navigation {activeSection} onSectionChange={handleSectionChange} />

			<!-- Time Range Selector (only for relevant sections) -->
			{#if activeSection === 'overview' || activeSection === 'top-tracks' || activeSection === 'top-artists'}
				<TimeRangeSelector {selectedTimeRange} on:change={handleTimeRangeChange} />
			{/if}

			<!-- No Results Message -->
			{#if searchQuery && getCurrentSectionResults().length === 0}
				<div class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
					<div
						class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10"
					>
						<Search class="h-6 w-6 text-white/40" />
					</div>
					<h3 class="mb-2 text-lg font-semibold text-white">No results found</h3>
					<p class="text-white/60">
						Try adjusting your search terms to find what you're looking for.
					</p>
				</div>
			{:else}
				<!-- Content Sections -->
				{#if activeSection === 'overview'}
					<div class="space-y-12">
						<!-- Top Artists Overview -->
						{#if loadingStates.topArtists}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">Top Artists</h2>
								</div>
								<LoadingStates type="artist" count={10} />
							</section>
						{:else if errorStates.topArtists}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">Top Artists</h2>
								</div>
								<ErrorState
									showError={true}
									errorMessage="Failed to load top artists"
									onRetry={retryTopArtists}
								/>
							</section>
						{:else if filteredData.topArtists.length > 0}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">
										Top Artists
										{#if searchQuery}
											<span class="text-sm font-normal text-white/60">
												({filteredData.topArtists.length} of {topArtists.length})
											</span>
										{/if}
									</h2>
									<button
										on:click={() => handleSectionChange('top-artists')}
										class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-transform hover:bg-white/10 active:scale-95"
									>
										View All
									</button>
								</div>
								<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
									{#each filteredData.topArtists.slice(0, 10) as artist}
										<article
											class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-95"
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
						{#if loadingStates.topTracks}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">Top Tracks</h2>
								</div>
								<LoadingStates type="track" count={5} />
							</section>
						{:else if errorStates.topTracks}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">Top Tracks</h2>
								</div>
								<ErrorState
									showError={true}
									errorMessage="Failed to load top tracks"
									onRetry={retryTopTracks}
								/>
							</section>
						{:else if filteredData.topTracks.length > 0}
							<section>
								<div class="mb-6 flex items-end justify-between gap-4">
									<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">
										Top Tracks
										{#if searchQuery}
											<span class="text-sm font-normal text-white/60">
												({filteredData.topTracks.length} of {topTracks.length})
											</span>
										{/if}
									</h2>
									<button
										on:click={() => handleSectionChange('top-tracks')}
										class="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition-transform hover:bg-white/10 active:scale-95"
									>
										View All
									</button>
								</div>
								<div class="space-y-3">
									{#each filteredData.topTracks.slice(0, 5) as track, index}
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
					{#if loadingStates.topTracks}
						<LoadingStates type="track" count={20} />
					{:else if errorStates.topTracks}
						<ErrorState
							showError={true}
							errorMessage="Failed to load top tracks"
							onRetry={retryTopTracks}
						/>
					{:else}
						<TopTracks topTracks={filteredData.topTracks} />
					{/if}
				{:else if activeSection === 'top-artists'}
					{#if loadingStates.topArtists}
						<LoadingStates type="artist" count={20} />
					{:else if errorStates.topArtists}
						<ErrorState
							showError={true}
							errorMessage="Failed to load top artists"
							onRetry={retryTopArtists}
						/>
					{:else}
						<div class="space-y-6">
							<h2 class="text-xl font-bold sm:text-2xl lg:text-3xl">
								Your Top Artists
								{#if searchQuery}
									<span class="text-sm font-normal text-white/60">
										({filteredData.topArtists.length} of {topArtists.length})
									</span>
								{/if}
							</h2>
							<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
								{#each filteredData.topArtists as artist}
									<article
										class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10 active:scale-95"
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
													<i data-lucide="user" class="h-8 w-8 text-white/40"></i>
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
						</div>
					{/if}
				{:else if activeSection === 'recently-played'}
					{#if loadingStates.recentlyPlayed}
						<LoadingStates type="track" count={10} />
					{:else if errorStates.recentlyPlayed}
						<ErrorState
							showError={true}
							errorMessage="Failed to load recently played tracks"
							onRetry={retryRecentlyPlayed}
						/>
					{:else}
						<RecentlyPlayed recentlyPlayed={filteredData.recentlyPlayed} {searchQuery} />
					{/if}
				{:else if activeSection === 'playlists'}
					{#if loadingStates.playlists}
						<LoadingStates type="playlist" count={10} />
					{:else if errorStates.playlists}
						<ErrorState
							showError={true}
							errorMessage="Failed to load playlists"
							onRetry={retryPlaylists}
						/>
					{:else}
						<SavedPlaylists playlists={filteredData.playlists} />
					{/if}
				{:else if activeSection === 'followed-artists'}
					{#if loadingStates.followedArtists}
						<LoadingStates type="artist" count={10} />
					{:else if errorStates.followedArtists}
						<ErrorState
							showError={true}
							errorMessage="Failed to load followed artists"
							onRetry={retryFollowedArtists}
						/>
					{:else}
						<FollowedArtists followedArtists={filteredData.followedArtists} />
					{/if}
				{:else if activeSection === 'saved-albums'}
					{#if loadingStates.savedAlbums}
						<LoadingStates type="album" count={10} />
					{:else if errorStates.savedAlbums}
						<ErrorState
							showError={true}
							errorMessage="Failed to load saved albums"
							onRetry={retrySavedAlbums}
						/>
					{:else}
						<SavedAlbums savedAlbums={filteredData.savedAlbums} />
					{/if}
				{:else if activeSection === 'saved-tracks'}
					{#if loadingStates.savedTracks}
						<LoadingStates type="track" count={10} />
					{:else if errorStates.savedTracks}
						<ErrorState
							showError={true}
							errorMessage="Failed to load saved tracks"
							onRetry={retrySavedTracks}
						/>
					{:else}
						<SavedTracks
							savedTracks={filteredData.savedTracks}
							hasMore={hasMoreSavedTracks}
							onLoadMore={loadMoreSavedTracks}
						/>
					{/if}
				{:else if activeSection === 'devices'}
					{#if loadingStates.devices}
						<LoadingStates type="track" count={5} />
					{:else if errorStates.devices}
						<ErrorState
							showError={true}
							errorMessage="Failed to load devices"
							onRetry={retryDevices}
						/>
					{:else}
						<DevicesInfo {devices} />
					{/if}
				{/if}
			{/if}
		</div>
	{/if}
</main>

<!-- Footer -->
<footer class="bg-canvas/80 border-t border-white/5 backdrop-blur">
	<div class="mx-auto max-w-6xl px-3 py-6 sm:px-4">
		<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
			<div class="flex items-center gap-2">
				<div class="teal-500 flex h-6 w-6 items-center justify-center rounded-lg">
					<img src="/favicon.png" alt="Spotify Stats" class="h-6 w-6 rounded-sm" />
				</div>
				<span class="text-sm text-white/60">Spotify Stats Fetcher</span>
			</div>
			<div class="flex items-center gap-4 text-xs text-white/50">
				<span>Made with ❤️ by Liam</span>
				<span class="hidden sm:inline">•</span>
				<span class="hidden sm:inline">Powered by Spotify Web API</span>
			</div>
		</div>
	</div>
</footer>
