<script lang="ts">
	import TrackCard from './TrackCard.svelte';

	export let recentlyPlayed: any[] = [];
</script>

{#if recentlyPlayed.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Recently Played</h2>
		<div class="grid gap-4">
			{#each recentlyPlayed as track, index}
				<TrackCard
					track={track.track}
					{index}
					showRanking={false}
					showAlbum={true}
					showDuration={true}
					showPopularity={false}
					showPlayedAt={true}
					playedAt={track.played_at}
					showContext={true}
					context={track.context}
				/>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Recently Played</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No recently played tracks found.</p>
		</div>
	</div>
{/if}
