<script lang="ts">
	import {
		Monitor,
		Smartphone,
		Speaker,
		Tv,
		Gamepad2,
		Music,
		Volume2,
		Volume1,
		VolumeX,
		Check,
		Lock,
		Wifi,
		WifiOff,
		AlertTriangle
	} from '@lucide/svelte';

	export let devices: any[] = [];

	function getDeviceIcon(deviceType: string) {
		switch (deviceType.toLowerCase()) {
			case 'computer':
				return Monitor;
			case 'smartphone':
				return Smartphone;
			case 'speaker':
				return Speaker;
			case 'tv':
				return Tv;
			case 'game_console':
				return Gamepad2;
			default:
				return Music;
		}
	}

	function getVolumeIcon(volume: number) {
		if (volume === 0) return VolumeX;
		if (volume < 30) return Volume1;
		return Volume2;
	}

	function getDeviceStatus(device: any) {
		if (device.is_active) return { text: 'Active', color: 'emerald', icon: Check };
		if (device.is_restricted) return { text: 'Restricted', color: 'yellow', icon: AlertTriangle };
		return { text: 'Available', color: 'gray', icon: Wifi };
	}
</script>

{#if devices.length > 0}
	<div class="mx-auto w-full max-w-4xl">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Available Devices</h2>
			<p class="text-white/60">Manage your Spotify playback across devices</p>
		</div>

		<div class="grid gap-4">
			{#each devices as device}
				{@const status = getDeviceStatus(device)}
				<article
					class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-2xl hover:shadow-emerald-500/10"
				>
					<!-- Gradient overlay for visual depth -->
					<div
						class="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-emerald-300/5 via-emerald-400/5 to-teal-300/5 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
					></div>

					<div class="relative p-6">
						<div class="flex items-center justify-between">
							<div class="flex items-center space-x-4">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 transition-transform duration-300 group-hover:scale-105"
								>
									<svelte:component
										this={getDeviceIcon(device.type)}
										class="h-7 w-7 text-emerald-300"
									/>
								</div>

								<div class="flex-1">
									<div class="mb-2 flex items-center gap-3">
										<h3
											class="text-lg font-semibold text-white transition-colors group-hover:text-emerald-300"
										>
											{device.name}
										</h3>
										<span
											class="inline-flex items-center rounded-full border border-{status.color}-300/20 bg-{status.color}-400/10 px-2 py-1 text-xs font-medium text-{status.color}-300"
										>
											<svelte:component this={status.icon} class="mr-1 h-3 w-3" />
											{status.text}
										</span>
									</div>

									<div class="flex flex-wrap items-center gap-4 text-sm text-white/60">
										<div class="flex items-center gap-1">
											<svelte:component this={getDeviceIcon(device.type)} class="h-4 w-4" />
											<span class="capitalize">{device.type.replace('_', ' ')}</span>
										</div>

										{#if device.volume_percent !== undefined}
											<div class="flex items-center gap-1">
												<svelte:component
													this={getVolumeIcon(device.volume_percent)}
													class="h-4 w-4"
												/>
												<span>{device.volume_percent}% volume</span>
											</div>
										{/if}

										{#if device.is_private_session}
											<div class="flex items-center gap-1">
												<Lock class="h-4 w-4" />
												<span>Private Session</span>
											</div>
										{/if}
									</div>
								</div>
							</div>

							<div class="flex items-center space-x-2">
								{#if device.is_restricted}
									<div class="flex items-center gap-1 text-yellow-400">
										<AlertTriangle class="h-4 w-4" />
										<span class="text-sm">Restricted</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</article>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-4xl text-center">
		<div class="mb-8 text-center">
			<h2 class="mb-2 text-3xl font-bold text-white">Available Devices</h2>
			<p class="text-white/60">Manage your Spotify playback across devices</p>
		</div>

		<div class="rounded-2xl border border-white/10 bg-white/5 p-12 backdrop-blur">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50"
			>
				<WifiOff class="h-8 w-8 text-white/40" />
			</div>
			<p class="mb-2 text-white/60">No devices found</p>
			<p class="text-sm text-white/40">Make sure Spotify is open on at least one device</p>
		</div>
	</div>
{/if}
