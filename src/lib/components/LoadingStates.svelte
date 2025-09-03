<script lang="ts">
	export let type: 'track' | 'artist' | 'album' | 'playlist' | 'profile' = 'track';
	export let count: number = 5;
</script>

{#if type === 'track'}
	<div class="space-y-4">
		{#each Array(count) as _, i}
			<div class="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
				<!-- Album art skeleton -->
				<div class="h-12 w-12 animate-pulse rounded-lg bg-white/10"></div>

				<!-- Track info skeleton -->
				<div class="flex-1 space-y-2">
					<div class="h-4 w-3/4 animate-pulse rounded bg-white/10"></div>
					<div class="h-3 w-1/2 animate-pulse rounded bg-white/5"></div>
					<div class="h-3 w-1/3 animate-pulse rounded bg-white/5"></div>
				</div>

				<!-- Duration skeleton -->
				<div class="h-3 w-10 animate-pulse rounded bg-white/5"></div>
			</div>
		{/each}
	</div>
{:else if type === 'artist'}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
		{#each Array(count) as _, i}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<!-- Artist image skeleton -->
				<div class="aspect-square animate-pulse rounded-xl bg-white/10"></div>

				<!-- Artist info skeleton -->
				<div class="mt-3 space-y-2">
					<div class="h-4 w-full animate-pulse rounded bg-white/10"></div>
					<div class="h-3 w-2/3 animate-pulse rounded bg-white/5"></div>
					<div class="flex justify-between">
						<div class="h-3 w-8 animate-pulse rounded bg-white/5"></div>
						<div class="h-3 w-8 animate-pulse rounded bg-white/5"></div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{:else if type === 'album'}
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
		{#each Array(count) as _, i}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<!-- Album art skeleton -->
				<div class="aspect-square animate-pulse rounded-xl bg-white/10"></div>

				<!-- Album info skeleton -->
				<div class="mt-3 space-y-2">
					<div class="h-4 w-full animate-pulse rounded bg-white/10"></div>
					<div class="h-3 w-3/4 animate-pulse rounded bg-white/5"></div>
					<div class="h-3 w-1/2 animate-pulse rounded bg-white/5"></div>
				</div>
			</div>
		{/each}
	</div>
{:else if type === 'playlist'}
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
		{#each Array(count) as _, i}
			<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
				<!-- Playlist image skeleton -->
				<div class="aspect-square animate-pulse rounded-xl bg-white/10"></div>

				<!-- Playlist info skeleton -->
				<div class="mt-3 space-y-2">
					<div class="h-4 w-full animate-pulse rounded bg-white/10"></div>
					<div class="h-3 w-2/3 animate-pulse rounded bg-white/5"></div>
					<div class="h-3 w-1/3 animate-pulse rounded bg-white/5"></div>
				</div>
			</div>
		{/each}
	</div>
{:else if type === 'profile'}
	<div class="rounded-2xl border border-white/10 bg-white/5 p-6">
		<div
			class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6"
		>
			<!-- Profile image skeleton -->
			<div class="h-24 w-24 animate-pulse rounded-2xl bg-white/10"></div>

			<!-- Profile info skeleton -->
			<div class="flex-1 space-y-3 text-center md:text-left">
				<div class="h-6 w-48 animate-pulse rounded bg-white/10"></div>
				<div class="h-4 w-32 animate-pulse rounded bg-white/5"></div>
				<div class="h-8 w-36 animate-pulse rounded bg-white/5"></div>
			</div>
		</div>
	</div>
{/if}
