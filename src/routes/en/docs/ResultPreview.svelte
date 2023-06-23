<script lang="ts">
	import { api_key_preferences } from '$lib/stores';
	import type { Writable } from 'svelte/store';
	import HighchartContainer from '$lib/HighchartContainer.svelte';

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

    let options = {
		title: {
			text: 'U.S Solar Employment Growth',
			align: 'left'
		},

		subtitle: {
			text: 'By Job Category. Source: <a href="https://irecusa.org/programs/solar-jobs-census/" target="_blank">IREC</a>.',
			align: 'left'
		},

		yAxis: {
			title: {
				text: 'Number of Employees'
			}
		},

		xAxis: {
			accessibility: {
				rangeDescription: 'Range: 2010 to 2020'
			}
		},

		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},

		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart: 2010
			}
		},

		series: [
			{
				name: 'Installation & Developers',
				data: [43934, 48656, 65165, 81827, 112143, 142383, 171533, 165174, 155157, 161454, 154610]
			},
			{
				name: 'Manufacturing',
				data: [24916, 37941, 29742, 29851, 32490, 30282, 38121, 36885, 33726, 34243, 31050]
			},
			{
				name: 'Sales & Distribution',
				data: [11744, 30000, 16005, 19771, 20185, 24377, 32147, 30912, 29243, 29213, 25663]
			},
			{
				name: 'Operations & Maintenance',
				data: [null, null, null, null, null, null, null, null, 11164, 11218, 10077]
			},
			{
				name: 'Other',
				data: [21908, 5548, 8105, 11248, 8989, 11816, 18274, 17300, 13053, 11906, 10073]
			}
		],

		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 500
					},
					chartOptions: {
						legend: {
							layout: 'horizontal',
							align: 'center',
							verticalAlign: 'bottom'
						}
					}
				}
			]
		}
	};


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
    <HighchartContainer options={options}/>
	<div id="container" style="height: 400px; width: 100%">
        <div class="h-100 d-flex justify-content-center align-items-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
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
