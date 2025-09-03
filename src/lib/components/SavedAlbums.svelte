<script lang="ts">
	export let savedAlbums: any[] = [];

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if savedAlbums.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Saved Albums</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each savedAlbums as albumData}
				{@const album = albumData.album}
				<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
					<div class="mb-4 aspect-square">
						{#if album.images && album.images.length > 0}
							<img
								src={album.images[0].url}
								alt={album.name}
								class="h-full w-full rounded-md object-cover"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center rounded-md bg-gray-600">
								<svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<div class="space-y-2">
						<h3 class="truncate font-semibold text-white" title={album.name}>
							{album.name}
						</h3>

						<p class="truncate text-sm text-gray-400">
							{album.artists.map((artist: any) => artist.name).join(', ')}
						</p>

						{#if album.album_type}
							<div class="text-sm text-gray-500 capitalize">
								{album.album_type}
							</div>
						{/if}

						{#if album.total_tracks}
							<div class="text-sm text-gray-500">
								{album.total_tracks} tracks
							</div>
						{/if}

						{#if album.release_date}
							<div class="text-sm text-gray-500">
								Released: {formatDate(album.release_date)}
							</div>
						{/if}

						{#if albumData.added_at}
							<div class="text-sm text-gray-500">
								Added: {formatDate(albumData.added_at)}
							</div>
						{/if}

						{#if album.external_urls?.spotify}
							<a
								href={album.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-3 block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-white transition duration-300 hover:bg-green-700"
							>
								Open in Spotify
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Your Saved Albums</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No saved albums found.</p>
		</div>
	</div>
{/if}
