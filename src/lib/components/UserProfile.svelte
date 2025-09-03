<script lang="ts">
	import { User, Crown, Users, MapPin, ExternalLink } from '@lucide/svelte';

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
	<div
		class="shadow-glow relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur"
	>
		<div
			class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 blur-2xl"
		></div>
		<div class="relative p-6">
			<div
				class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-6"
			>
				{#if userProfile.images && userProfile.images.length > 0}
					<img
						src={userProfile.images[0].url}
						alt={userProfile.display_name}
						class="h-24 w-24 rounded-2xl border-2 border-white/10 object-cover"
					/>
				{:else}
					<div
						class="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-white/10 bg-gradient-to-br from-gray-700/50 to-gray-800/50"
					>
						<User class="h-12 w-12 text-white/40" />
					</div>
				{/if}

				<div class="flex-1 text-center md:text-left">
					<div class="mb-3 flex flex-col md:flex-row md:items-center md:space-x-4">
						<h1 class="text-2xl font-bold text-white">{userProfile.display_name}</h1>
						{#if userProfile.product === 'premium'}
							<span
								class="inline-flex items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-300"
							>
								<Crown class="mr-1 h-3 w-3" />
								Premium
							</span>
						{/if}
					</div>

					<div class="flex flex-col text-sm text-white/60 md:flex-row md:space-x-6">
						<div class="flex items-center space-x-2">
							<Users class="h-4 w-4" />
							<span>{formatNumber(userProfile.followers?.total || 0)} followers</span>
						</div>

						{#if userProfile.country}
							<div class="flex items-center space-x-2">
								<MapPin class="h-4 w-4" />
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
								class="shadow-glow inline-flex items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 font-medium text-emerald-300 transition duration-300 hover:bg-emerald-400/20"
							>
								<ExternalLink class="mr-2 h-4 w-4" />
								View on Spotify
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
