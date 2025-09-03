<script lang="ts">
	import { Clock, TrendingUp, Zap } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let selectedTimeRange: string = 'medium_term';

	const timeRanges = [
		{
			id: 'short_term',
			label: 'Last 4 weeks',
			description: 'Recent favorites',
			icon: Clock,
			color: 'text-blue-400'
		},
		{
			id: 'medium_term',
			label: 'Last 6 months',
			description: 'Popular tracks',
			icon: TrendingUp,
			color: 'text-emerald-400'
		},
		{
			id: 'long_term',
			label: 'All time',
			description: 'Lifetime favorites',
			icon: Zap,
			color: 'text-purple-400'
		}
	];

	function selectTimeRange(timeRange: string) {
		selectedTimeRange = timeRange;
		console.log('TimeRangeSelector: Dispatching change event with timeRange:', timeRange);
		dispatch('change', { timeRange });
	}
</script>

<div class="space-y-3">
	<div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
		{#each timeRanges as range}
			<button
				on:click={() => selectTimeRange(range.id)}
				class="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 text-left transition-all duration-300 hover:border-emerald-300/30 hover:bg-white/10 active:scale-95 {selectedTimeRange ===
				range.id
					? 'border-emerald-300/30 bg-emerald-400/10 shadow-md shadow-emerald-500/10'
					: ''}"
			>
				<div class="flex items-center gap-3 sm:items-start">
					<div
						class="flex-shrink-0 rounded-lg bg-white/5 p-2 transition-colors duration-200 {selectedTimeRange ===
						range.id
							? 'bg-emerald-400/20 text-emerald-300'
							: 'text-white/60 group-hover:text-white/80'} {range.color}"
					>
						<svelte:component this={range.icon} class="h-4 w-4" />
					</div>
					<div class="min-w-0 flex-1">
						<h4 class="text-sm font-semibold text-white">
							{range.label}
						</h4>
						<p class="mt-0.5 hidden text-xs text-white/50 sm:block">
							{range.description}
						</p>
					</div>
				</div>
				{#if selectedTimeRange === range.id}
					<div
						class="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/5 to-emerald-300/5"
					></div>
				{/if}
			</button>
		{/each}
	</div>
</div>
