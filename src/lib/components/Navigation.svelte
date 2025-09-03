<script lang="ts">
	export let activeSection: string = 'overview';
	export let onSectionChange: (section: string) => void;

	const sections = [
		{ id: 'overview', name: 'Overview', icon: '🏠' },
		{ id: 'top-tracks', name: 'Top Tracks', icon: '🎵' },
		{ id: 'top-artists', name: 'Top Artists', icon: '🎤' },
		{ id: 'recently-played', name: 'Recently Played', icon: '⏰' },
		{ id: 'playlists', name: 'Playlists', icon: '📋' },
		{ id: 'followed-artists', name: 'Followed Artists', icon: '👥' },
		{ id: 'saved-albums', name: 'Saved Albums', icon: '💿' },
		{ id: 'saved-tracks', name: 'Saved Tracks', icon: '❤️' },
		{ id: 'devices', name: 'Devices', icon: '🔊' }
	];
</script>

<nav class="mb-8 rounded-lg bg-gray-800 p-4">
	<div class="flex flex-wrap justify-center gap-2">
		{#each sections as section}
			<button
				on:click={() => onSectionChange(section.id)}
				class="flex items-center space-x-2 rounded-lg px-4 py-2 transition duration-300 {activeSection ===
				section.id
					? 'bg-green-600 text-white'
					: 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'}"
			>
				<span class="text-lg">{section.icon}</span>
				<span class="font-medium">{section.name}</span>
			</button>
		{/each}
	</div>
</nav>
