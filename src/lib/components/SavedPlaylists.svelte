<script lang="ts">
	import { Music, Eye, Lock, ExternalLink, Users } from '@lucide/svelte';

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
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Your Playlists</h2>
			<p class="text-white/60">Discover and manage your music collections</p>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each playlists as playlist}
				<article
					class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
				>
					<!-- Gradient overlay for visual depth -->
					<div
						class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
					></div>

					<div class="relative p-5">
						<!-- Playlist Image -->
						<div class="mb-4 aspect-square overflow-hidden rounded-xl">
							{#if playlist.images && playlist.images.length > 0}
								<img
									src={playlist.images[0].url}
									alt={playlist.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700/50 to-gray-800/50"
								>
									<Music class="h-16 w-16 text-white/40" />
								</div>
							{/if}
						</div>

						<!-- Playlist Info -->
						<div class="space-y-3">
							<div>
								<h3
									class="truncate text-lg font-semibold text-white transition-colors group-hover:text-emerald-300"
									title={playlist.name}
								>
									{playlist.name}
								</h3>

								{#if playlist.description}
									<p class="line-clamp-2 text-sm text-white/70" title={playlist.description}>
										{playlist.description}
									</p>
								{/if}
							</div>

							<!-- Stats and Meta -->
							<div class="flex items-center justify-between text-sm">
								<div class="flex items-center gap-1 text-white/60">
									<Music class="h-4 w-4" />
									<span>{formatNumber(playlist.tracks?.total || 0)} tracks</span>
								</div>

								{#if playlist.public !== undefined}
									<div class="flex items-center gap-1 text-white/60">
										{#if playlist.public}
											<Eye class="h-4 w-4" />
											<span>Public</span>
										{:else}
											<Lock class="h-4 w-4" />
											<span>Private</span>
										{/if}
									</div>
								{/if}
							</div>

							{#if playlist.owner}
								<div class="flex items-center gap-1 text-xs text-white/50">
									<Users class="h-3 w-3" />
									<span class="truncate">by {playlist.owner.display_name}</span>
								</div>
							{/if}

							<!-- Spotify Link Button -->
							{#if playlist.external_urls?.spotify}
								<a
									href={playlist.external_urls.spotify}
									target="_blank"
									rel="noopener noreferrer"
									class="shadow-glow flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-300/40 hover:bg-emerald-400/20"
								>
									<ExternalLink class="h-4 w-4" />
									Open in Spotify
								</a>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Your Playlists</h2>
			<p class="text-white/60">Discover and manage your music collections</p>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50"
			>
				<Music class="h-8 w-8 text-white/40" />
			</div>
			<p class="text-white/60">No playlists found.</p>
		</div>
	</div>
{/if}
