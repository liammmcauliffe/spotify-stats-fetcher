<script lang="ts">
    import { onMount } from 'svelte';
    import { callSpotifyApi } from '$lib/spotify';

    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = 'http://127.0.0.1:5173';

    let errorMessage = '';
    let isLoading = false;
    let isLoggedIn = false;
    let topArtists: any[] = [];

    onMount(() => {
        const existingToken = localStorage.getItem('access_token');
        if (existingToken) {
            isLoggedIn = true;
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
            errorMessage = `Spotify authorization error: ${error}`;
            return;
        }

        if (code) {
            getToken(code);
        }
    });

    async function fetchTopArtists() {
        try {
            const data = await callSpotifyApi('/me/top/artists?time_range=long_term&limit=10');
            topArtists = data.items;
            console.log('Top artists:', topArtists);
        } catch (error) {
            console.error('Failed to fetch top artists:', error);
            errorMessage = 'Failed to fetch top artists.';
        }
    }

    async function redirectToSpotifyLogin() {
        if (!clientId) {
            errorMessage = 'Spotify Client ID is not configured. Please check your environment variables.';
            return;
        }

        errorMessage = '';
        isLoading = true;

        try {
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
        } catch (error) {
            errorMessage = `Error during login: ${error}`;
            isLoading = false;
        }
    }

    async function getToken(code: string) {
        isLoading = true;
        errorMessage = '';

        const codeVerifier = localStorage.getItem('code_verifier');

        if (!codeVerifier) {
            errorMessage = 'Code verifier not found in local storage.';
            isLoading = false;
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
            const tokenData = await response.json();

            if (!response.ok) {
                throw new Error(`Token request failed: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
            }

            localStorage.setItem('access_token', tokenData.access_token);
            localStorage.setItem('refresh_token', tokenData.refresh_token);

            console.log('Successfully obtained access token');
            isLoggedIn = true;
            isLoading = false;

            // Clean up the URL
            window.history.pushState({}, '', redirectUri);
        } catch (error) {
            console.error('Error fetching token:', error);
            errorMessage = `Failed to get access token: ${error}`;
            isLoading = false;
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

    function logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('code_verifier');
        isLoggedIn = false;
        topArtists = [];
    }
</script>

<main class="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
    <div class="text-center max-w-md" style="width:100%">
        <h1 class="text-5xl font-bold mb-4">Spotify Stats Fetcher</h1>
        
        {#if isLoggedIn}
            <div class="bg-green-800 p-4 rounded-lg mb-4">
                <p class="text-lg mb-4">✅ Successfully logged in to Spotify!</p>
                <button
                    on:click={logout}
                    class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                >
                    Logout
                </button>
            </div>
            <div class="w-full max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold mb-6 text-center">Your Stats</h2>
                <div class="text-center mb-8">
                    <button
                        on:click={fetchTopArtists}
                        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300"
                    >
                        Fetch My Top Artists
                    </button>
                </div>
                {#if topArtists.length > 0}
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {#each topArtists as artist}
                            <div class="bg-gray-800 p-4 rounded-lg text-center hover:bg-gray-700 transition">
                                {#if artist.images && artist.images.length > 0}
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        class="w-full h-auto rounded-full aspect-square object-cover mx-auto mb-4"
                                    />
                                {/if}
                                <p class="font-semibold truncate">{artist.name}</p>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <p class="text-lg text-gray-400 mb-8">Log in to see your personal listening stats.</p>
            
            {#if errorMessage}
                <div class="bg-red-800 p-4 rounded-lg mb-4">
                    <p class="text-red-200">{errorMessage}</p>
                </div>
            {/if}

            <button
                on:click={redirectToSpotifyLogin}
                disabled={isLoading}
                class="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Loading...' : 'Log in with Spotify'}
            </button>
        {/if}

        {#if !clientId}
            <div class="bg-yellow-800 p-4 rounded-lg mt-4">
                <p class="text-yellow-200 text-sm">⚠️ Missing Spotify Client ID configuration</p>
            </div>
        {/if}
    </div>
</main>