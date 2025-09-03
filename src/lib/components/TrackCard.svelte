<script lang="ts">
	import { Music, List, Disc, Mic, Play } from '@lucide/svelte';

	export let track: any;
	export let index: number | null = null;
	export let showRanking: boolean = false;
	export let showAlbum: boolean = true;
	export let showDuration: boolean = true;
	export let showPopularity: boolean = false;
	export let showAddedDate: boolean = false;
	export let showPlayedAt: boolean = false;
	export let showContext: boolean = false;
	export let context: any = null;
	export let playedAt: string | null = null;
	export let addedAt: string | null = null;

	function formatDuration(ms: number): string {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

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

	function getContextIcon(context: any) {
		if (!context) return Music;
		if (context.type === 'playlist') return List;
		if (context.type === 'album') return Disc;
		if (context.type === 'artist') return Mic;
		return Music;
	}

	function getContextName(context: any): string {
		if (!context) return 'Direct Play';
		return context.name || 'Direct Play';
	}
</script>

<article
	class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
>
	<div class="flex items-center gap-4 p-4">
		<!-- Ranking Number -->
		{#if showRanking && index !== null}
			<div class="w-8 flex-shrink-0 text-center">
				<span class="text-lg font-bold text-emerald-400">#{index + 1}</span>
			</div>
		{/if}

		<!-- Album Art -->
		<div class="relative">
			{#if track.album.images && track.album.images.length > 0}
				<img
					src={track.album.images[0].url}
					alt={track.album.name}
					class="h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-lg"
				/>
			{:else}
				<div
					class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-gray-700/50 to-gray-800/50 shadow-lg"
				>
					<Music class="h-6 w-6 text-white/40" />
				</div>
			{/if}

			<!-- Play indicator overlay -->
			{#if track.external_urls?.spotify}
				<a
					href={track.external_urls.spotify}
					target="_blank"
					rel="noopener noreferrer"
					class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
					aria-label="Open track in Spotify"
				>
					<div class="rounded-full bg-emerald-500 p-1.5">
						<Play class="h-3 w-3 text-white" />
					</div>
				</a>
			{/if}
		</div>

		<!-- Track Info -->
		<div class="min-w-0 flex-1">
			<h3 class="truncate font-semibold text-white transition-colors group-hover:text-emerald-300">
				{track.name}
			</h3>
			<p class="truncate text-sm text-white/70">
				{track.artists.map((artist: any) => artist.name).join(', ')}
			</p>
			{#if showAlbum}
				<p class="truncate text-xs text-white/50">{track.album.name}</p>
			{/if}
		</div>

		<!-- Additional Info -->
		<div class="flex flex-col items-end gap-1 text-xs text-white/60">
			{#if showDuration}
				<div class="font-mono">{formatDuration(track.duration_ms)}</div>
			{/if}

			{#if showPopularity && track.popularity}
				<div>Popularity: {track.popularity}%</div>
			{/if}

			{#if showAddedDate && addedAt}
				<div>Added: {formatDate(addedAt)}</div>
			{/if}

			{#if showPlayedAt && playedAt}
				<div>{formatTimeAgo(playedAt)}</div>
			{/if}

			{#if showContext && context}
				<div class="flex items-center gap-1">
					<svelte:component this={getContextIcon(context)} class="h-3 w-3" />
					<span class="max-w-20 truncate">{getContextName(context)}</span>
				</div>
			{/if}
		</div>
	</div>
</article>
