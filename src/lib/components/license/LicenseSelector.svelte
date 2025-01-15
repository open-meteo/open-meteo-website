<script lang="ts">
	import { api_key_preferences } from '$lib/stores/settings';

	import { fade } from 'svelte/transition';
	interface Props {
		requires_professional_plan?: boolean;
	}

	let { requires_professional_plan = false }: Props = $props();
</script>

<div class="row py-3 px-0">
	<div>
		<ul class="nav nav-underline" role="tablist">
			<li class="nav-item" role="presentation">
				<span class="nav-link disabled" aria-disabled="true">Usage License:</span>
			</li>
			<li class="nav-item" role="presentation">
				<button
					class="nav-link"
					class:active={$api_key_preferences.use == 'non_commercial'}
					id="pills-non_commercial-tab"
					type="button"
					role="tab"
					aria-controls="pills-non_commercial"
					aria-selected="true"
					onclick={() => ($api_key_preferences.use = 'non_commercial')}>Non-Commercial</button
				>
			</li>
			<li class="nav-item" role="presentation">
				<button
					class="nav-link"
					class:active={$api_key_preferences.use == 'commercial'}
					id="pills-commercial-tab"
					type="button"
					role="tab"
					aria-controls="pills-commercial"
					onclick={() => ($api_key_preferences.use = 'commercial')}
					aria-selected="true">Commercial</button
				>
			</li>
			<li class="nav-item" role="presentation">
				<button
					class="nav-link"
					class:active={$api_key_preferences.use == 'self_hosted'}
					id="pills-self_hosted-tab"
					type="button"
					role="tab"
					aria-controls="pills-self_hosted"
					onclick={() => ($api_key_preferences.use = 'self_hosted')}
					aria-selected="true">Self-Hosted</button
				>
			</li>
		</ul>
	</div>

	<div class="tab-content py-3">
		{#if $api_key_preferences.use == 'non_commercial'}
			<div
				class="tab-pane active"
				in:fade
				id="pills-non_commercial"
				role="tabpanel"
				aria-labelledby="pills-non_commercial-tab"
				tabindex="0"
			>
				<div class="col-md-12">
					<div class=" alert alert-info" role="alert">
						Only for <strong>non-commercial use</strong> and less than 10.000 daily API calls. See
						<a href="/en/terms">Terms</a> for more details.
					</div>
				</div>
			</div>
		{/if}
		{#if $api_key_preferences.use == 'commercial'}
			<div
				class="tab-pane active"
				in:fade
				id="pills-commercial"
				role="tabpanel"
				aria-labelledby="pills-commercial-tab"
				tabindex="0"
			>
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
							See <a href="/en/pricing">Pricing</a> for more details.{#if requires_professional_plan}
								This API requires the <mark>Professional</mark> subscription.{/if}
						</div>
					</div>
				</div>
			</div>
		{/if}
		{#if $api_key_preferences.use == 'self_hosted'}
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
