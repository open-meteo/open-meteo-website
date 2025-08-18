<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { api_key_preferences } from '$lib/stores/settings';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';

	import * as Alert from '$lib/components/ui/alert';

	interface Props {
		requires_professional_plan?: boolean;
	}

	let { requires_professional_plan = false }: Props = $props();

	let licenseSelected = $state('');

	onMount(() => {
		licenseSelected = $api_key_preferences.use;
	});
</script>

<div>
	<div class="-mr-6 flex items-center gap-2 overflow-auto md:mr-0">
		<div class="text-muted-foreground text-nowrap">Usage license:</div>
		<div class="border-border flex rounded-md border">
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-e-none !opacity-100 duration-300 {licenseSelected ===
				'non_commercial'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={licenseSelected === 'non_commercial'}
				onclick={() => {
					licenseSelected = 'non_commercial';
					$api_key_preferences.use = licenseSelected;
				}}
			>
				Non-Commercial
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-none !opacity-100 duration-300 {licenseSelected ===
				'commercial'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={licenseSelected === 'commercial'}
				onclick={() => {
					licenseSelected = 'commercial';
					$api_key_preferences.use = licenseSelected;
				}}
			>
				Commercial
			</Button>
			<Button
				variant="ghost"
				class="items-center gap-1 rounded-s-none !opacity-100 duration-300 {licenseSelected ===
				'self_hosted'
					? 'bg-accent cursor-not-allowed'
					: ''}"
				disabled={licenseSelected === 'self_hosted'}
				onclick={() => {
					licenseSelected = 'self_hosted';
					$api_key_preferences.use = licenseSelected;
				}}
			>
				Self-Hosted
			</Button>
		</div>
	</div>
	<div class="relative mt-3 md:mt-6">
		{#if licenseSelected === 'non_commercial'}
			<div in:fade>
				<Alert.Root variant="info">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-info-icon lucide-info"
						><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
					>
					<Alert.Description>
						<div>
							Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See
							<a class="text-link underline" href="/en/terms">Terms</a> for more details.
						</div>
					</Alert.Description>
				</Alert.Root>
			</div>
		{:else if licenseSelected === 'commercial'}
			<div in:fade class="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
				<div class="relative flex">
					<Input
						id="apikey"
						name="apikey"
						type="text"
						class="h-12 pt-6"
						bind:value={$api_key_preferences.apikey}
						required
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="apikey">API Key</Label
					>
				</div>
				<div class="md:col-span-2">
					<Alert.Root variant="info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-info-icon lucide-info"
							><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
						>
						<Alert.Description>
							See <a class="text-link underline" href="/en/pricing">Pricing</a> for more details.{#if requires_professional_plan}
								This API requires the <mark>Professional</mark> subscription.{/if}
						</Alert.Description>
					</Alert.Root>
				</div>
			</div>
		{:else if licenseSelected === 'self_hosted'}
			<div in:fade class="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6">
				<div class="relative flex">
					<Input
						id="self_host_server"
						name="self_host_server"
						type="text"
						class="h-12 pt-6"
						bind:value={$api_key_preferences.self_host_server}
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="apikey">Server URL</Label
					>
				</div>
				<div class="md:col-span-2">
					<Alert.Root variant="info">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-info-icon lucide-info"
							><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg
						>
						<Alert.Description>
							<div class="inline">
								See <a class="text-link underline" href="https://github.com/open-meteo/open-meteo"
									>GitHub</a
								> for more instructions. Make sure your node supports HTTPS.
							</div>
						</Alert.Description>
					</Alert.Root>
				</div>
			</div>
		{/if}
	</div>
</div>
