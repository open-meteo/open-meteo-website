<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Switch } from '$lib/components/ui/switch';

	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import { defaultParameters } from './options';
	import { pythonPreviewCodeExample } from './python-preview-code-example';

	let { data } = $props();

	let d = new SvelteDate();
	d.setUTCDate(d.getUTCDate() - 1);
	d.setUTCHours(0);
	d.setUTCMinutes(0);
	d.setUTCSeconds(0);
	d.setUTCMilliseconds(0);

	const params = urlHashStore({
		...defaultParameters,
		latitude: [52.52],
		longitude: [13.41],
		domain: 'ecmwf_ifs'
	});

	let codeInstallCopied = $state(false);
	let codeExampleCopied = $state(false);
</script>

<div>
	<LocationSelection bind:params={$params} />

	<div class="mt-3 md:mt-6 flex gap-3 md:gap-6 flex-col">
		<a href="#endpoint">
			<h2 id="endpoint" class="text-2xl md:text-3xl">Endpoint</h2>
		</a>
		<div class="flex items-center gap-4">
			<div
				class="flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-all duration-300 cursor-pointer select-none
					{!$params.use_aws_endpoint
					? 'border-primary bg-primary/5 scale-105 shadow-sm'
					: 'border-border text-muted-foreground scale-100'}"
				role="button"
				tabindex="0"
				onclick={() => {
					$params.use_aws_endpoint = false;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') $params.use_aws_endpoint = true;
				}}
			>
				<span class="font-medium text-sm">AWS Open Data</span>
				<span class="text-xs">Last 3 months of forecast data only</span>
				<code class="text-xs mt-1 opacity-70">https://openmeteo.s3.amazonaws.com</code>
			</div>
			<Switch
				checked={$params.use_aws_endpoint}
				class="shrink-0"
				onCheckedChange={(checked) => {
					$params.use_aws_endpoint = checked;
				}}
			/>
			<div
				class="flex flex-col gap-0.5 rounded-lg border px-3 py-2 transition-all duration-300 cursor-pointer select-none
					{$params.use_aws_endpoint
					? 'border-primary bg-primary/5 scale-105 shadow-sm'
					: 'border-border text-muted-foreground scale-100'}"
				role="button"
				tabindex="0"
				onclick={() => {
					$params.use_aws_endpoint = true;
				}}
				onkeydown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') $params.use_aws_endpoint = false;
				}}
			>
				<span class="font-medium text-sm">Open-Meteo S3</span>
				<span class="text-xs">Full history available</span>
				<code class="text-xs mt-1 opacity-70">https://s3.open-meteo.com/openmeteo/</code>
			</div>
		</div>
	</div>

	<div class="mt-3 md:mt-6 flex gap-3 md:gap-6">
		<div class="flex flex-col gap-3 md:gap-6">
			<a href="#models">
				<h2 id="models" class="text-2xl md:text-3xl">Domain</h2>
			</a>
			<div class="relative">
				<Select.Root name="models" type="single" bind:value={$params.domain}>
					<Select.Trigger class="min-w-80 data-placeholder:text-foreground h-12 cursor-pointer pt-6"
						>{$params.domain}</Select.Trigger
					>
					<Select.Content preventScroll={false} class="border-border">
						{#each data.models as domain (domain)}
							<Select.Item value={domain}>{domain}</Select.Item>
						{/each}
					</Select.Content>
					<Label class="text-muted-foreground absolute top-[0.35rem] left-2 z-10 px-1 text-xs"
						>Domains</Label
					>
				</Select.Root>
			</div>
		</div>
		<div class="flex flex-col gap-3 md:gap-6">
			<a href="#model-runs">
				<h2 id="model-runs" class="text-2xl md:text-3xl">Model runs</h2>
			</a>
			<div class="relative"></div>
		</div>
		<div class="flex flex-col gap-3 md:gap-6">
			<a href="#variables">
				<h2 id="variables" class="text-2xl md:text-3xl">Variables</h2>
			</a>
			<div class="relative"></div>
		</div>
	</div>

	<div class="mt-3 md:mt-6 flex gap-3 md:gap-6 flex-col">
		<a href="#python-preview">
			<h2 id="python-preview" class="text-2xl md:text-3xl">Python preview</h2>
		</a>

		<div class="code-example relative group">
			{@html pythonPreviewCodeExample(
				$params.domain || 'ecmwf_ifs',
				'temperature_2m',
				Number($params.latitude?.[0] ?? 52.52),
				Number($params.longitude?.[0] ?? 13.41)
			)}
			<div
				class="absolute duration-300 right-2 top-2 lg:right-4 lg:top-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto"
			>
				<Button
					onclick={() => {
						const query = document.querySelector('.code-example pre');
						if (query) {
							navigator.clipboard.writeText(query.textContent ?? '').catch(() => {});
							codeExampleCopied = true;
							setTimeout(() => {
								codeExampleCopied = false;
							}, 1250);
						}
					}}
					>{#if codeExampleCopied}<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-check-icon lucide-check"><path d="M20 6 9 17l-5-5" /></svg
						>{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.4"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-clipboard-copy-icon lucide-clipboard-copy"
							><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path
								d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
							/><path d="M16 4h2a2 2 0 0 1 2 2v4" /><path d="M21 14H11" /><path
								d="m15 10-4 4 4 4"
							/></svg
						>{/if}</Button
				>
			</div>
		</div>
	</div>
</div>
