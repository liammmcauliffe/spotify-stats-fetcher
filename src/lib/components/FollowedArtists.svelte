<script lang="ts">
	import { User, Users, TrendingUp } from '@lucide/svelte';
	import LoadingStates from './LoadingStates.svelte';
	import ErrorState from './ErrorState.svelte';

	export let followedArtists: any[] = [];
	export let isLoading: boolean = false;
	export let hasError: boolean = false;
	export let onRetry: (() => void) | null = null;

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

{#if isLoading}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-6 flex items-end justify-between gap-4">
			<h2 class="text-2xl font-bold sm:text-3xl">Artists You Follow</h2>
		</div>
		<LoadingStates type="artist" count={10} />
	</div>
{:else if hasError}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-6 flex items-end justify-between gap-4">
			<h2 class="text-2xl font-bold sm:text-3xl">Artists You Follow</h2>
		</div>
		<ErrorState showError={true} errorMessage="Failed to load followed artists" {onRetry} />
	</div>
{:else if followedArtists.length > 0}
	<div class="mx-auto w-full max-w-6xl">
		<div class="mb-6 flex items-end justify-between gap-4">
			<h2 class="text-2xl font-bold sm:text-3xl">Artists You Follow</h2>
		</div>
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
			{#each followedArtists as artist}
				<article
					class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
					style="transform-style: preserve-3d;"
					on:mouseenter={(e) => {
						const card = e.currentTarget;
						card.style.transition = 'transform 0.1s ease-out';
					}}
					on:mouseleave={(e) => {
						const card = e.currentTarget;
						card.style.transition = 'transform 0.3s ease-out';
						card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
					}}
					on:mousemove={(e) => {
						const card = e.currentTarget;
						const rect = card.getBoundingClientRect();
						const centerX = rect.left + rect.width / 2;
						const centerY = rect.top + rect.height / 2;

						const mouseX = e.clientX - centerX;
						const mouseY = e.clientY - centerY;

						const rotateX = (mouseY / rect.height) * -20;
						const rotateY = (mouseX / rect.width) * 20;

						card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
					}}
				>
					<div class="aspect-square p-4">
						{#if artist.images && artist.images.length > 0}
							<img
								src={artist.images[0].url}
								alt={artist.name}
								class="h-full w-full rounded-xl object-cover"
							/>
						{:else}
							<div
								class="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-700/50 to-gray-800/50"
							>
								<User class="h-8 w-8 text-white/40" />
							</div>
						{/if}
					</div>
					<div class="p-3">
						<h3 class="truncate text-sm font-semibold">{artist.name}</h3>
						{#if artist.genres && artist.genres.length > 0}
							<p class="mt-1 truncate text-xs text-white/60 capitalize">
								{artist.genres[0]}
							</p>
						{:else}
							<p class="mt-1 truncate text-xs text-white/60">Artist</p>
						{/if}
						<div class="mt-1 flex items-center justify-between text-xs text-white/50">
							<div class="flex items-center gap-1">
								<Users class="h-3 w-3" />
								<span>{formatNumber(artist.followers?.total || 0)}</span>
							</div>
							{#if artist.popularity}
								<div class="flex items-center gap-1">
									<TrendingUp class="h-3 w-3" />
									<span>{artist.popularity}%</span>
								</div>
							{/if}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-6xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Artists You Follow</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">No followed artists found.</p>
		</div>
	</div>
{/if}
