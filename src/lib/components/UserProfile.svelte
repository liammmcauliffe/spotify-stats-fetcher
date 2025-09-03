<script lang="ts">
	export let userProfile: any;

	function formatNumber(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + 'M';
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + 'K';
		}
		return num.toString();
	}
</script>

{#if userProfile}
	<div class="mx-auto w-full max-w-4xl rounded-lg bg-gray-800 p-6 shadow-lg">
		<div
			class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6"
		>
			{#if userProfile.images && userProfile.images.length > 0}
				<img
					src={userProfile.images[0].url}
					alt={userProfile.display_name}
					class="h-32 w-32 rounded-full object-cover shadow-md"
				/>
			{:else}
				<div class="flex h-32 w-32 items-center justify-center rounded-full bg-gray-600">
					<svg class="h-16 w-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
			{/if}

			<div class="flex-1 text-center md:text-left">
				<div class="mb-2 flex flex-col md:flex-row md:items-center md:space-x-4">
					<h1 class="text-3xl font-bold text-white">{userProfile.display_name}</h1>
					{#if userProfile.product === 'premium'}
						<span
							class="inline-flex items-center rounded-full bg-green-600 px-3 py-1 text-sm font-medium text-white"
						>
							<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								/>
							</svg>
							Premium
						</span>
					{/if}
				</div>

				<div class="flex flex-col text-gray-400 md:flex-row md:space-x-6">
					<div class="flex items-center space-x-2">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>{formatNumber(userProfile.followers?.total || 0)} followers</span>
					</div>

					{#if userProfile.country}
						<div class="flex items-center space-x-2">
							<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clip-rule="evenodd"
								/>
							</svg>
							<span>{userProfile.country}</span>
						</div>
					{/if}
				</div>

				{#if userProfile.external_urls?.spotify}
					<div class="mt-4">
						<a
							href={userProfile.external_urls.spotify}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition duration-300 hover:bg-green-700"
						>
							<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
									clip-rule="evenodd"
								/>
							</svg>
							View on Spotify
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
