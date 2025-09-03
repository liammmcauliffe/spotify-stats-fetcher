<script lang="ts">
	export let showError: boolean = false;
	export let errorMessage: string = 'Failed to load data';
	export let onRetry: (() => void) | null = null;
</script>

{#if showError}
	<div class="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
		<div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
			<svg class="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				></path>
			</svg>
		</div>
		<p class="mb-4 text-red-300">{errorMessage}</p>
		{#if onRetry}
			<button
				on:click={onRetry}
				class="rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300 transition-colors duration-200 hover:bg-red-400/20"
			>
				Try Again
			</button>
		{/if}
	</div>
{/if}
