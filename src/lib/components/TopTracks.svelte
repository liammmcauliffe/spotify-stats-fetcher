<script lang="ts">
	import TrackCard from './TrackCard.svelte';

	export let topTracks: any[] = [];
</script>

{#if topTracks.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Your Top Tracks</h2>
		<div class="grid gap-4">
			{#each topTracks as track, index}
				<TrackCard
					{track}
					{index}
					showRanking={true}
					showAlbum={true}
					showDuration={true}
					showPopularity={true}
				/>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Your Top Tracks</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No top tracks found.</p>
		</div>
	</div>
{/if}
