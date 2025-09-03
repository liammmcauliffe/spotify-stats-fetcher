<script lang="ts">
	export let recentlyPlayed: any[] = [];

	function formatTimeAgo(playedAt: string): string {
		const now = new Date();
		const played = new Date(playedAt);
		const diffInMinutes = Math.floor((now.getTime() - played.getTime()) / (1000 * 60));

		if (diffInMinutes < 1) return 'Just now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) return `${diffInHours}h ago`;

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) return `${diffInDays}d ago`;

		return played.toLocaleDateString();
	}

	function getContextIcon(context: any): string {
		if (!context) return '🎵';
		if (context.type === 'playlist') return '📋';
		if (context.type === 'album') return '💿';
		if (context.type === 'artist') return '🎤';
		return '🎵';
	}

	function getContextName(context: any): string {
		if (!context) return 'Unknown';
		return context.name || 'Unknown';
	}
</script>

{#if recentlyPlayed.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Recently Played</h2>
		<div class="grid gap-4">
			{#each recentlyPlayed as track}
				<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
					<div class="flex items-center space-x-4">
						{#if track.track.album.images && track.track.album.images.length > 0}
							<img
								src={track.track.album.images[0].url}
								alt={track.track.album.name}
								class="h-16 w-16 flex-shrink-0 rounded-md object-cover"
							/>
						{:else}
							<div
								class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md bg-gray-600"
							>
								<svg class="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.828 1 1 0 01-1.415-1.414A3.987 3.987 0 0013 12a3.987 3.987 0 00-.172-1.414 1 1 0 010-1.415z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}

						<div class="min-w-0 flex-1">
							<div class="flex flex-col md:flex-row md:items-center md:justify-between">
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-lg font-semibold text-white">{track.track.name}</h3>
									<p class="truncate text-gray-400">
										{track.track.artists.map((artist: any) => artist.name).join(', ')}
									</p>
									<p class="truncate text-sm text-gray-500">{track.track.album.name}</p>
								</div>

								<div class="mt-2 flex flex-col md:mt-0 md:items-end">
									<div class="flex items-center space-x-2 text-sm text-gray-400">
										<span>{getContextIcon(track.context)}</span>
										<span class="max-w-32 truncate">{getContextName(track.context)}</span>
									</div>
									<div class="text-sm text-gray-500">
										{formatTimeAgo(track.played_at)}
									</div>
								</div>
							</div>
						</div>

						{#if track.track.external_urls?.spotify}
							<a
								href={track.track.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								class="ml-4 p-2 text-gray-400 transition duration-300 hover:text-white"
								aria-label="Open track in Spotify"
							>
								<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
										clip-rule="evenodd"
									/>
								</svg>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Recently Played</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No recently played tracks found.</p>
		</div>
	</div>
{/if}
