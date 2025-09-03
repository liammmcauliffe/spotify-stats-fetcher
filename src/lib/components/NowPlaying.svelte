<script lang="ts">
	export let currentlyPlaying: any;

	function formatDuration(ms: number) {
		const minutes = Math.floor(ms / 60000);
		const seconds = ((ms % 60000) / 1000).toFixed(0);
		return minutes + ':' + (parseInt(seconds) < 10? '0' : '') + seconds;
	}
</script>

{#if currentlyPlaying && currentlyPlaying.item}
	<div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
		<h2 class="text-xl font-bold text-green-400 mb-4 text-center">Now Playing</h2>
		<div class="flex items-center space-x-6">
			<img
				src={currentlyPlaying.item.album.images.url}
				alt={currentlyPlaying.item.album.name}
				class="w-32 h-32 rounded-md object-cover shadow-md"
			/>
			<div class="flex-1">
				<p class="text-2xl font-bold text-white truncate">{currentlyPlaying.item.name}</p>
				<p class="text-lg text-gray-400">
					{currentlyPlaying.item.artists.map((artist: any) => artist.name).join(', ')}
				</p>

				<div class="mt-4">
					<div class="w-full bg-gray-600 rounded-full h-2">
						<div
							class="bg-green-500 h-2 rounded-full"
							style="width: {(currentlyPlaying.progress_ms / currentlyPlaying.item.duration_ms) * 100}%"
						/>
					</div>
					<div class="flex justify-between text-sm text-gray-400 mt-1">
						<span>{formatDuration(currentlyPlaying.progress_ms)}</span>
						<span>{formatDuration(currentlyPlaying.item.duration_ms)}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto text-center">
		<p class="text-gray-400">Nothing is currently playing.</p>
	</div>
{/if}