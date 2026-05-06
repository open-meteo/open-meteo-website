<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';

	import { urlHashStore } from '$lib/stores/url-hash-store';

	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	import LocationSelection from '$lib/components/location/location-selection.svelte';

	import { defaultParameters } from './options';

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
		models: ['ecmwf_ifs']
	});

	let modelSelected = 'ecmwf_ifs';

	console.log(data);
</script>

<div>
	<LocationSelection bind:params={$params} />

	<div class="mt-3 md:mt-6 flex gap-3 md:gap-6">
		<div class="flex flex-col gap-3 md:gap-6">
			<a href="#models">
				<h2 id="models" class="text-2xl md:text-3xl">Domain</h2>
			</a>
			<div class="relative">
				<Select.Root name="models" type="single" bind:value={$params.models}>
					<Select.Trigger class="min-w-80 data-placeholder:text-foreground h-12 cursor-pointer pt-6"
						>{modelSelected}</Select.Trigger
					>
					<Select.Content preventScroll={false} class="border-border">
						{#each data.models as model (model)}
							<Select.Item value={model}>{model}</Select.Item>
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
</div>
