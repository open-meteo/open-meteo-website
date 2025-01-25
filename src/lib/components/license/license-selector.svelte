<script lang="ts">
	import { fade } from 'svelte/transition';

	import { api_key_preferences } from '$lib/stores/settings';

	import Input from '../ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	interface Props {
		requires_professional_plan?: boolean;
	}

	let { requires_professional_plan = false }: Props = $props();

	let licenseSelected = $state('non_commercial');
</script>

<div class="overflow-hidden">
	<ToggleGroup.Root type="single" bind:value={licenseSelected} class="justify-start gap-0">
		<ToggleGroup.Item
			value="non_commercial"
			class=" min-h-12 rounded-e-none !opacity-100 lg:min-h-[unset]"
			aria-label="Toggle bold"
			disabled={licenseSelected === 'non_commercial'}
		>
			Non-Commercial
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="commercial"
			class="min-h-12 rounded-none !opacity-100 lg:min-h-[unset]"
			aria-label="Toggle italic"
			disabled={licenseSelected === 'commercial'}
		>
			Commercial
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="self_hosted"
			class="min-h-12 rounded-s-none !opacity-100 lg:min-h-[unset]"
			aria-label="Toggle strikethrough"
			disabled={licenseSelected === 'self_hosted'}
		>
			Self-Hosted
		</ToggleGroup.Item>
	</ToggleGroup.Root>
	<div class="relative mt-3">
		{#if licenseSelected === 'non_commercial'}
			<div in:fade>
				<Alert.Root variant="informative">
					<Alert.Description>
						Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See
						<a href={'/en/terms'}>Terms</a> for more details.
					</Alert.Description>
				</Alert.Root>
			</div>
		{:else if licenseSelected === 'commercial'}
			<div in:fade class="flex gap-3">
				<div class="relative flex md:w-1/3">
					<Input
						class="h-13 pt-6"
						type="text"
						name="apikey"
						id="apikey"
						bind:value={$api_key_preferences.apikey}
						required
					/>
					<Label class="text-muted-foreground text-xxs absolute left-2 top-2 z-10 px-1" for="apikey"
						>API Key</Label
					>
				</div>
				<div class="md:w-2/3">
					<Alert.Root variant="informative">
						<Alert.Description>
							See <a href={'/en/pricing'}>Pricing</a> for more details.{#if requires_professional_plan}
								This API requires the <mark>Professional</mark> subscription.{/if}
						</Alert.Description>
					</Alert.Root>
				</div>
			</div>
		{:else if licenseSelected === 'self_hosted'}
			<div in:fade class="flex gap-3">
				<div class="relative flex md:w-1/3">
					<Input
						class="h-13 pt-6"
						type="text"
						name="self_host_server"
						id="self_host_server"
						bind:value={$api_key_preferences.self_host_server}
					/>
					<Label class="text-muted-foreground text-xxs absolute left-2 top-2 z-10 px-1" for="apikey"
						>Server URL</Label
					>
				</div>
				<div class="md:w-2/3">
					<Alert.Root variant="informative">
						<Alert.Description>
							See <a href="https://github.com/open-meteo/open-meteo">GitHub</a> for more instructions.
							Make sure your node supports HTTPS.
						</Alert.Description>
					</Alert.Root>
				</div>
			</div>
		{/if}
	</div>
</div>
