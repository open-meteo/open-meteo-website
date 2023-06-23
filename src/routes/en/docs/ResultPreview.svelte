<script lang="ts">
	import { api_key_preferences } from '$lib/stores';
	import type { Writable } from 'svelte/store';

	export let params: Writable<any>;
	export let type: String | undefined;
    export let defaultParameter: any

    // Only considers keys of the first object
    function objectDifference<T extends Record<string, any>>(a: T, b: T): Partial<T> {
		const diff: Partial<T> = {};
		for (const key in a) {
			if (a[key] !== b[key]) {
				diff[key] = a[key];
			}
		}
		return diff;
	}

	let action = `https://api.open-meteo.com/v1/forecast?`;
    let actionParams = {}
	$: switch ($api_key_preferences.use) {
		case 'commercial':
			action = `https://customer-api.open-meteo.com/v1/search?`;
            actionParams = {apikey: $api_key_preferences.apikey}
			break;
		case 'self_hosted':
			action = `${$api_key_preferences.self_host_server}/v1/forecast?`;
			break;
		default:
			action = 'https://api.open-meteo.com/v1/forecast?';
	}
    $: nonDefaultParameter = objectDifference({...$params, ...actionParams}, defaultParameter);
	$: previewUrl = `${action}${new URLSearchParams(nonDefaultParameter)}`;
    $: xlsxUrl = `${action}${new URLSearchParams({...nonDefaultParameter, format: 'xlsx'})}`;
    $: csvUrl = `${action}${new URLSearchParams({...nonDefaultParameter, format: 'csv'})}`;
</script>

<div class="col-12 my-4">
	<h2>Preview and API URL</h2>
	<div id="container" style="height: 400px; width: 100%" />
</div>
<div class="col-12">
	<button type="submit" class="btn btn-primary">Preview Chart</button>
	<a href={xlsxUrl} class="btn btn-outline-primary"
		>Download XLSX</a
	>
	<a href={csvUrl} class="btn btn-outline-primary" 
		>Download CSV</a
	>
</div>

<div class="col-12 my-4">
	<label for="api_url" class="form-label">API URL</label>
	<small class="text-muted"
		>(<a id="api_url_link" target="_blank" href={previewUrl}>Open in new tab</a> or copy this URL into your application)</small
	>
	<input type="text" class="form-control" id="api_url" readonly bind:value={previewUrl}/>
</div>
