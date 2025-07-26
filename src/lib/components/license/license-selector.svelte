<script lang="ts">
	import { onMount } from 'svelte';

	import { fade } from 'svelte/transition';

	import { api_key_preferences } from '$lib/stores/settings';

	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	import * as Alert from '$lib/components/ui/alert';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

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
	<div class="flex items-center">
		<div class="text-muted-foreground">Usage license:</div>
		<div class="border-border ml-2 flex rounded-lg border">
			<ToggleGroup.Root
				type="single"
				bind:value={licenseSelected}
				onValueChange={() => ($api_key_preferences.use = licenseSelected)}
				class="justify-start text-nowrap flex flex-wrap gap-0"
			>
				<ToggleGroup.Item
					id="non_commercial"
					value="non_commercial"
					class=" min-h-12 cursor-pointer rounded-e-none opacity-100! lg:min-h-[unset]"
					disabled={licenseSelected === 'non_commercial'}
				>
					Non-Commercial
				</ToggleGroup.Item>
				<ToggleGroup.Item
					id="commercial"
					value="commercial"
					class="min-h-12 cursor-pointer rounded-none opacity-100! lg:min-h-[unset]"
					disabled={licenseSelected === 'commercial'}
				>
					Commercial
				</ToggleGroup.Item>
				<ToggleGroup.Item
					id="self_hosted"
					value="self_hosted"
					class="min-h-12 cursor-pointer rounded-s-none opacity-100! lg:min-h-[unset]"
					disabled={licenseSelected === 'self_hosted'}
				>
					Self-Hosted
				</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	</div>
	<div class="relative mt-3 md:mt-6">
		{#if licenseSelected === 'non_commercial'}
			<div in:fade>
				<Alert.Root class="border-border">
					<Alert.Description>
						Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See
						<a class="text-link underline" href="/en/terms">Terms</a> for more details.
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
						class="h-13 pt-6"
						bind:value={$api_key_preferences.apikey}
						required
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="apikey">API Key</Label
					>
				</div>
				<div class="md:col-span-2">
					<Alert.Root class="border-border">
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
						class="h-13 pt-6"
						bind:value={$api_key_preferences.self_host_server}
					/>
					<Label
						class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						for="apikey">Server URL</Label
					>
				</div>
				<div class="md:col-span-2">
					<Alert.Root class="border-border">
						<Alert.Description>
							See <a class="text-link underline" href="https://github.com/open-meteo/open-meteo"
								>GitHub</a
							> for more instructions. Make sure your node supports HTTPS.
						</Alert.Description>
					</Alert.Root>
				</div>
			</div>
		{/if}
	</div>
</div>
