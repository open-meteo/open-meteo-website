<script lang="ts">
	import { fade } from 'svelte/transition';

	import { i18n } from '$lib/i18n';

	import { api_key_preferences } from '$lib/stores/settings';

	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	interface Props {
		requires_professional_plan?: boolean;
	}

	let { requires_professional_plan = false }: Props = $props();

	let licenseSelected = $state('non_commercial');
</script>

<div class="overflow-hidden rounded-lg bg-[#282c34] p-6 text-white">
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
	<div class="relative min-h-[550px] lg:min-h-[500px]">
		{#if licenseSelected === 'non_commercial'}
			<div
				in:fade
				id="pills-non_commercial"
				role="tabpanel"
				aria-labelledby="pills-non_commercial-tab"
				tabindex="0"
			>
				<div class="col-md-12">
					<div class=" alert alert-info" role="alert">
						Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See
						<a href={i18n.route('/terms')}>Terms</a> for more details.
					</div>
				</div>
			</div>
		{:else if licenseSelected === 'commercial'}
			<div in:fade id="commercial" role="tabpanel" aria-labelledby="commercial-tab" tabindex="0">
				<div class="row">
					<div class="col-md-3">
						<div class="form-floating">
							<input
								type="text"
								class="form-control"
								name="apikey"
								id="apikey"
								bind:value={$api_key_preferences.apikey}
								required
							/>
							<label for="apikey">API Key</label>
						</div>
					</div>
					<div class="col-md-9">
						<div class="alert alert-info" role="alert">
							See <a href={i18n.route('/pricing')}>Pricing</a> for more details.{#if requires_professional_plan}
								This API requires the <mark>Professional</mark> subscription.{/if}
						</div>
					</div>
				</div>
			</div>
		{:else if licenseSelected === 'self_hosted'}
			<div
				class="tab-pane active"
				in:fade
				id="pills-self_hosted"
				role="tabpanel"
				aria-labelledby="pills-self_hosted-tab"
				tabindex="0"
			>
				<div class="row">
					<div class="col-md-3">
						<div class="form-floating">
							<input
								type="text"
								class="form-control"
								name="self_host_server"
								id="self_host_server"
								bind:value={$api_key_preferences.self_host_server}
							/>
							<label for="self_host_server">Server URL</label>
						</div>
					</div>
					<div class="col-md-9">
						<div class="alert alert-info" role="alert">
							See <a href="https://github.com/open-meteo/open-meteo">GitHub</a> for more instructions.
							Make sure your node supports HTTPS.
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
