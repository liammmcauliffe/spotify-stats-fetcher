<script lang="ts">
	export let followedArtists: any[] = [];

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

{#if followedArtists.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Artists You Follow</h2>
		<div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
			{#each followedArtists as artist}
				<div
					class="rounded-lg bg-gray-800 p-4 text-center transition duration-300 hover:bg-gray-700"
				>
					<div class="mb-4 aspect-square">
						{#if artist.images && artist.images.length > 0}
							<img
								src={artist.images[0].url}
								alt={artist.name}
								class="h-full w-full rounded-full object-cover"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center rounded-full bg-gray-600">
								<svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>
						{/if}
					</div>

					<div class="space-y-2">
						<h3 class="truncate font-semibold text-white" title={artist.name}>
							{artist.name}
						</h3>

						{#if artist.genres && artist.genres.length > 0}
							<p class="truncate text-sm text-gray-400" title={artist.genres.join(', ')}>
								{artist.genres.slice(0, 2).join(', ')}
								{#if artist.genres.length > 2}
									...
								{/if}
							</p>
						{/if}

						<div class="text-sm text-gray-500">
							{formatNumber(artist.followers?.total || 0)} followers
						</div>

						{#if artist.popularity}
							<div class="text-sm text-gray-500">
								Popularity: {artist.popularity}%
							</div>
						{/if}

						{#if artist.external_urls?.spotify}
							<a
								href={artist.external_urls.spotify}
								target="_blank"
								rel="noopener noreferrer"
								class="mt-3 block w-full rounded-lg bg-green-600 px-4 py-2 text-center text-white transition duration-300 hover:bg-green-700"
							>
								View Artist
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Artists You Follow</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No followed artists found.</p>
		</div>
	</div>
{/if}
