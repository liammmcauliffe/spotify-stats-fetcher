<script lang="ts">
	import { Disc, Music, Calendar, Plus, ExternalLink, Users } from '@lucide/svelte';
	import LoadingStates from './LoadingStates.svelte';
	import ErrorState from './ErrorState.svelte';

	export let savedAlbums: any[] = [];
	export let isLoading: boolean = false;
	export let hasError: boolean = false;
	export let onRetry: (() => void) | null = null;

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if isLoading}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Your Saved Albums</h2>
			<p class="text-white/60">Your personal music collection</p>
		</div>
		<LoadingStates type="album" count={10} />
	</div>
{:else if hasError}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Your Saved Albums</h2>
			<p class="text-white/60">Your personal music collection</p>
		</div>
		<ErrorState showError={true} errorMessage="Failed to load saved albums" {onRetry} />
	</div>
{:else if savedAlbums.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Your Saved Albums</h2>
			<p class="text-white/60">Your personal music collection</p>
		</div>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each savedAlbums as albumData}
				{@const album = albumData.album}
				<article
					class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
				>
					<!-- Gradient overlay for visual depth -->
					<div
						class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
					></div>

					<div class="relative p-5">
						<!-- Album Image -->
						<div class="mb-4 aspect-square overflow-hidden rounded-xl">
							{#if album.images && album.images.length > 0}
								<img
									src={album.images[0].url}
									alt={album.name}
									class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							{:else}
								<div
									class="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-700/50 to-gray-800/50"
								>
									<Disc class="h-16 w-16 text-white/40" />
								</div>
							{/if}
						</div>

						<!-- Album Info -->
						<div class="space-y-3">
							<div>
								<h3
									class="truncate text-lg font-semibold text-white transition-colors group-hover:text-emerald-300"
									title={album.name}
								>
									{album.name}
								</h3>

								<p class="truncate text-sm text-white/70">
									{album.artists.map((artist: any) => artist.name).join(', ')}
								</p>
							</div>

							<!-- Album Details -->
							<div class="space-y-2 text-sm">
								{#if album.album_type}
									<div class="flex items-center gap-1 text-white/60">
										<Disc class="h-4 w-4" />
										<span class="capitalize">{album.album_type}</span>
									</div>
								{/if}

								{#if album.total_tracks}
									<div class="flex items-center gap-1 text-white/60">
										<Music class="h-4 w-4" />
										<span>{album.total_tracks} tracks</span>
									</div>
								{/if}

								{#if album.release_date}
									<div class="flex items-center gap-1 text-white/60">
										<Calendar class="h-4 w-4" />
										<span>Released {formatDate(album.release_date)}</span>
									</div>
								{/if}

								{#if albumData.added_at}
									<div class="flex items-center gap-1 text-white/50">
										<Plus class="h-3 w-3" />
										<span class="text-xs">Added {formatDate(albumData.added_at)}</span>
									</div>
								{/if}
							</div>

							<!-- Spotify Link Button -->
							{#if album.external_urls?.spotify}
								<a
									href={album.external_urls.spotify}
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
			<h2 class="mb-2 text-3xl font-bold text-white">Your Saved Albums</h2>
			<p class="text-white/60">Your personal music collection</p>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50"
			>
				<Disc class="h-8 w-8 text-white/40" />
			</div>
			<p class="text-white/60">No saved albums found.</p>
		</div>
	</div>
{/if}
