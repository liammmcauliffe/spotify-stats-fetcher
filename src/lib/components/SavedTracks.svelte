<script lang="ts">
	import TrackCard from './TrackCard.svelte';
	import LoadingStates from './LoadingStates.svelte';
	import ErrorState from './ErrorState.svelte';

	export let savedTracks: any[] = [];
	export let hasMore: boolean = false;
	export let onLoadMore: (() => void) | null = null;
	export let isLoading: boolean = false;
	export let hasError: boolean = false;
	export let onRetry: (() => void) | null = null;
</script>

{#if isLoading}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Saved Tracks</h2>
		<LoadingStates type="track" count={10} />
	</div>
{:else if hasError}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Saved Tracks</h2>
		<ErrorState showError={true} errorMessage="Failed to load saved tracks" {onRetry} />
	</div>
{:else if savedTracks.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Saved Tracks</h2>
		<div class="grid gap-4">
			{#each savedTracks as trackData, index}
				{@const track = trackData.track}
				<TrackCard
					{track}
					{index}
					showRanking={false}
					showAlbum={true}
					showDuration={true}
					showPopularity={true}
					showAddedDate={true}
					addedAt={trackData.added_at}
				/>
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
