<script lang="ts">
	import {
		Home,
		Music,
		Mic,
		Clock,
		List,
		Users,
		Disc,
		Heart,
		Speaker,
		TrendingUp,
		History
	} from '@lucide/svelte';

	export let activeSection: string = 'overview';
	export let onSectionChange: (section: string) => void;

	// Simple flat list of sections
	const sections = [
		{ id: 'overview', name: 'Overview', icon: Home },
		{ id: 'top-tracks', name: 'Top Tracks', icon: TrendingUp },
		{ id: 'top-artists', name: 'Top Artists', icon: Mic },
		{ id: 'recently-played', name: 'Recently Played', icon: History },
		{ id: 'playlists', name: 'Playlists', icon: List },
		{ id: 'followed-artists', name: 'Followed Artists', icon: Users },
		{ id: 'saved-albums', name: 'Saved Albums', icon: Disc },
		{ id: 'saved-tracks', name: 'Saved Tracks', icon: Heart },
		{ id: 'devices', name: 'Devices', icon: Speaker }
	];

	let showMobileMenu = false;

	function toggleMobileMenu() {
		showMobileMenu = !showMobileMenu;
	}
</script>

<nav class="mb-6">
	<!-- Desktop Navigation -->
	<div class="hidden lg:block">
		<div class="flex flex-wrap justify-center gap-1.5">
			{#each sections as section}
				<button
					on:click={() => onSectionChange(section.id)}
					class="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium transition-all duration-300 hover:border-emerald-300/30 hover:bg-white/10 active:scale-95 {activeSection ===
					section.id
						? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-300 shadow-sm shadow-emerald-500/10'
						: 'text-white/70 hover:text-white'}"
				>
					<svelte:component this={section.icon} class="h-3.5 w-3.5" />
					<span class="hidden sm:inline">{section.name}</span>
				</button>
			{/each}
		</div>
	</div>

	<!-- Mobile Navigation -->
	<div class="lg:hidden">
		<!-- Mobile Menu Button -->
		<div class="mb-3 flex justify-center">
			<button
				on:click={toggleMobileMenu}
				class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition-transform hover:bg-white/10 hover:text-white active:scale-95"
			>
				<img src="/favicon.png" alt="Menu" class="h-4 w-4 rounded-sm" />
				{sections.find((s) => s.id === activeSection)?.name || 'Menu'}
				<svg
					class="h-4 w-4 transition-transform duration-200 {showMobileMenu ? 'rotate-180' : ''}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
					></path>
				</svg>
			</button>
		</div>

		<!-- Mobile Menu Items -->
		{#if showMobileMenu}
			<div class="flex flex-wrap justify-center gap-1.5">
				{#each sections as section}
					<button
						on:click={() => {
							onSectionChange(section.id);
							showMobileMenu = false;
						}}
						class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:border-emerald-300/30 hover:bg-white/10 active:scale-95 {activeSection ===
						section.id
							? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-300'
							: 'text-white/70 hover:text-white'}"
					>
						<svelte:component this={section.icon} class="h-4 w-4" />
						{section.name}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</nav>
