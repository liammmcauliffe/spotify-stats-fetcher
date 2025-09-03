<script lang="ts">
	export let playlists: any[] = [];

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

{#if playlists.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Playlists</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each playlists as playlist}
				<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
					<div class="mb-4 aspect-square">
						{#if playlist.images && playlist.images.length > 0}
							<img
								src={playlist.images[0].url}
								alt={playlist.name}
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
						<h3 class="truncate font-semibold text-white" title={playlist.name}>
							{playlist.name}
						</h3>

						{#if playlist.description}
							<p class="line-clamp-2 text-sm text-gray-400" title={playlist.description}>
								{playlist.description}
							</p>
						{/if}

						<div class="flex items-center justify-between text-sm text-gray-500">
							<span>{formatNumber(playlist.tracks?.total || 0)} tracks</span>
							{#if playlist.public !== undefined}
								<span class="flex items-center">
									{#if playlist.public}
										<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
											<path
												fill-rule="evenodd"
												d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Public
									{:else}
										<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
												clip-rule="evenodd"
											/>
										</svg>
										Private
									{/if}
								</span>
							{/if}
						</div>

						{#if playlist.owner}
							<p class="truncate text-xs text-gray-500">
								by {playlist.owner.display_name}
							</p>
						{/if}

						{#if playlist.external_urls?.spotify}
							<a
								href={playlist.external_urls.spotify}
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
		<h2 class="mb-6 text-3xl font-bold">Your Playlists</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No playlists found.</p>
		</div>
	</div>
{/if}
