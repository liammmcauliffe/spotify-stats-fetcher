<script lang="ts">
	import { Home, Music, Mic, Clock, List, Users, Disc, Heart, Speaker } from '@lucide/svelte';

	export let activeSection: string = 'overview';
	export let onSectionChange: (section: string) => void;

	const sections = [
		{ id: 'overview', name: 'Overview', icon: Home },
		{ id: 'top-tracks', name: 'Top Tracks', icon: Music },
		{ id: 'top-artists', name: 'Top Artists', icon: Mic },
		{ id: 'recently-played', name: 'Recently Played', icon: Clock },
		{ id: 'playlists', name: 'Playlists', icon: List },
		{ id: 'followed-artists', name: 'Followed Artists', icon: Users },
		{ id: 'saved-albums', name: 'Saved Albums', icon: Disc },
		{ id: 'saved-tracks', name: 'Saved Tracks', icon: Heart },
		{ id: 'devices', name: 'Devices', icon: Speaker }
	];
</script>

<nav class="mb-8">
	<div class="flex flex-wrap justify-center gap-2">
		{#each sections as section}
			<button
				on:click={() => onSectionChange(section.id)}
				class="flex items-center space-x-2 rounded-xl px-4 py-2.5 transition duration-300 {activeSection ===
				section.id
					? 'shadow-glow border border-emerald-300/20 bg-emerald-400/10 text-emerald-300'
					: 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}"
			>
				<svelte:component this={section.icon} class="h-4 w-4" />
				<span class="text-sm font-medium">{section.name}</span>
			</button>
		{/each}
	</div>
</nav>
