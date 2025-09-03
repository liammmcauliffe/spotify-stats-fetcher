<script lang="ts">
	export let savedTracks: any[] = [];
	export let hasMore: boolean = false;
	export let onLoadMore: (() => void) | null = null;

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDuration(ms: number): string {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
	}
</script>

{#if savedTracks.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Saved Tracks</h2>
		<div class="grid gap-4">
			{#each savedTracks as trackData}
				{@const track = trackData.track}
				<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
					<div class="flex items-center space-x-4">
						{#if track.album.images && track.album.images.length > 0}
							<img
								src={track.album.images[0].url}
								alt={track.album.name}
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
									<h3 class="truncate text-lg font-semibold text-white">{track.name}</h3>
									<p class="truncate text-gray-400">
										{track.artists.map((artist: any) => artist.name).join(', ')}
									</p>
									<p class="truncate text-sm text-gray-500">{track.album.name}</p>
								</div>

								<div class="mt-2 flex items-center space-x-4 md:mt-0">
									<div class="text-sm text-gray-400">
										{formatDuration(track.duration_ms)}
									</div>

									{#if trackData.added_at}
										<div class="text-sm text-gray-500">
											Added: {formatDate(trackData.added_at)}
										</div>
									{/if}

									{#if track.popularity}
										<div class="text-sm text-gray-400">
											Popularity: {track.popularity}%
										</div>
									{/if}
								</div>
							</div>
						</div>

						{#if track.external_urls?.spotify}
							<a
								href={track.external_urls.spotify}
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

		{#if hasMore && onLoadMore}
			<div class="mt-8 text-center">
				<button
					on:click={onLoadMore}
					class="rounded-lg bg-green-600 px-8 py-3 font-bold text-white transition duration-300 hover:bg-green-700"
				>
					Load More Tracks
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Your Saved Tracks</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No saved tracks found.</p>
		</div>
	</div>
{/if}
