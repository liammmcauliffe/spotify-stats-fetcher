<script lang="ts">
	export let devices: any[] = [];

	function getDeviceIcon(deviceType: string): string {
		switch (deviceType.toLowerCase()) {
			case 'computer':
				return '💻';
			case 'smartphone':
				return '📱';
			case 'speaker':
				return '🔊';
			case 'tv':
				return '📺';
			case 'game_console':
				return '🎮';
			default:
				return '🎵';
		}
	}

	function getVolumeIcon(volume: number): string {
		if (volume === 0) return '🔇';
		if (volume < 30) return '🔈';
		if (volume < 70) return '🔉';
		return '🔊';
	}
</script>

{#if devices.length > 0}
	<div class="mx-auto w-full max-w-4xl">
		<h2 class="mb-6 text-center text-3xl font-bold">Available Devices</h2>
		<div class="grid gap-4">
			{#each devices as device}
				<div class="rounded-lg bg-gray-800 p-4 transition duration-300 hover:bg-gray-700">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-4">
							<div class="text-3xl">
								{getDeviceIcon(device.type)}
							</div>

							<div>
								<h3 class="text-lg font-semibold text-white">
									{device.name}
									{#if device.is_active}
										<span
											class="ml-2 inline-flex items-center rounded-full bg-green-600 px-2 py-1 text-xs font-medium text-white"
										>
											<svg class="mr-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd"
												/>
											</svg>
											Active
										</span>
									{/if}
								</h3>

								<div class="flex items-center space-x-4 text-sm text-gray-400">
									<span class="capitalize">{device.type.replace('_', ' ')}</span>

									{#if device.volume_percent !== undefined}
										<div class="flex items-center space-x-2">
											<span>{getVolumeIcon(device.volume_percent)}</span>
											<span>{device.volume_percent}%</span>
										</div>
									{/if}

									{#if device.is_private_session}
										<span class="flex items-center">
											<svg class="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
												<path
													fill-rule="evenodd"
													d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
													clip-rule="evenodd"
												/>
											</svg>
											Private Session
										</span>
									{/if}
								</div>
							</div>
						</div>

						<div class="flex items-center space-x-2">
							{#if device.is_restricted}
								<span class="text-sm text-yellow-400">Restricted</span>
							{/if}

							{#if device.supports_volume}
								<span class="text-sm text-green-400">Volume Control</span>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="mx-auto w-full max-w-4xl text-center">
		<h2 class="mb-6 text-3xl font-bold">Available Devices</h2>
		<div class="rounded-lg bg-gray-800 p-8">
			<p class="text-gray-400">
				No devices found. Make sure Spotify is open on at least one device.
			</p>
		</div>
	</div>
{/if}
