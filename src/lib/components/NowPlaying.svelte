<script lang="ts">
	import { Music, Play, Pause, Volume2 } from '@lucide/svelte';
	import LoadingStates from './LoadingStates.svelte';
	import ErrorState from './ErrorState.svelte';

	export let currentlyPlaying: any;
	export let isLoading: boolean = false;
	export let hasError: boolean = false;
	export let onRetry: (() => void) | null = null;

	function formatDuration(ms: number) {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
	}
</script>

{#if isLoading}
	<LoadingStates type="track" count={1} />
{:else if hasError}
	<ErrorState showError={true} errorMessage="Failed to load currently playing track" {onRetry} />
{:else if currentlyPlaying && currentlyPlaying.item}
	<div
		class="shadow-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
	>
		<div
			class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 blur-2xl"
		></div>
		<div class="relative p-6">
			<div class="mb-4 flex items-center justify-between">
				<div class="text-sm text-white/60">now playing</div>
				<div class="text-xs text-white/40">Live from Spotify</div>
			</div>

			<div class="flex items-center space-x-6">
				<img
					src={currentlyPlaying.item.album.images[0].url}
					alt={currentlyPlaying.item.album.name}
					class="h-20 w-20 rounded-2xl border-2 border-white/10 object-cover"
				/>
				<div class="flex-1">
					<h3 class="truncate text-xl font-bold text-white">{currentlyPlaying.item.name}</h3>
					<p class="truncate text-sm text-white/70">
						{currentlyPlaying.item.artists.map((artist: any) => artist.name).join(', ')}
					</p>
					<p class="truncate text-xs text-white/50">{currentlyPlaying.item.album.name}</p>

					<div class="mt-4">
						<div class="h-1 w-full rounded-full bg-white/10">
							<div
								class="h-1 rounded-full bg-emerald-400 transition-all duration-300"
								style="width: {(currentlyPlaying.progress_ms / currentlyPlaying.item.duration_ms) *
									100}%"
							></div>
						</div>
						<div class="mt-2 flex justify-between text-xs text-white/50">
							<span>{formatDuration(currentlyPlaying.progress_ms)}</span>
							<span>{formatDuration(currentlyPlaying.item.duration_ms)}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div
		class="shadow-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
	>
		<div
			class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 blur-2xl"
		></div>
		<div class="relative p-6">
			<div class="mb-4 flex items-center justify-between">
				<div class="text-sm text-white/60">now playing</div>
				<div class="text-xs text-white/40">Live from Spotify</div>
			</div>

			<div class="flex items-center space-x-6">
				<!-- Placeholder album art with music icon -->
				<div
					class="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/10 bg-gradient-to-br from-gray-700/50 to-gray-800/50"
				>
					<Music class="h-8 w-8 text-white/40" />
				</div>

				<div class="flex-1">
					<h3 class="text-xl font-bold text-white/60">No music playing</h3>
					<p class="text-sm text-white/50">Start playing something on Spotify</p>
					<p class="text-xs text-white/40">Your current track will appear here</p>

					<!-- Placeholder progress bar -->
					<div class="mt-4">
						<div class="h-1 w-full rounded-full bg-white/10">
							<div class="h-1 w-0 rounded-full bg-emerald-400/30"></div>
						</div>
						<div class="mt-2 flex justify-between text-xs text-white/40">
							<span>0:00</span>
							<span>--:--</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
