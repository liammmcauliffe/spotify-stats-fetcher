<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let placeholder: string = 'Search tracks, artists, albums...';
	export let value: string = '';

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		value = target.value;
		dispatch('search', { query: value });
	}

	function clearSearch() {
		value = '';
		dispatch('search', { query: '' });
	}
</script>

<!-- Search Input -->
<div class="relative">
	<div class="absolute top-1/2 left-3 -translate-y-1/2">
		<Search class="h-5 w-5 text-white/40" />
	</div>

	<input
		type="text"
		{placeholder}
		bind:value
		on:input={handleInput}
		class="w-full rounded-xl border border-white/10 bg-white/5 py-3 pr-12 pl-10 text-base text-white placeholder:text-white/40 focus:border-emerald-300/30 focus:ring-2 focus:ring-emerald-300/20 focus:outline-none"
	/>

	{#if value}
		<button
			on:click={clearSearch}
			class="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 transition-transform hover:bg-white/10 active:scale-95"
		>
			<X class="h-4 w-4 text-white/60" />
		</button>
	{/if}
</div>
