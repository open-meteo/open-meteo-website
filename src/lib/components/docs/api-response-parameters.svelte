<script module lang="ts">
	import type { ApiResponseParameter } from './api-response-parameter-table.svelte';

	// Shared response fields. Pages select fields and override API-specific differences.
	export const apiResponseParameters = {
		coordinates: {
			name: 'latitude, longitude',
			format: 'Floating point',
			description:
				'WGS84 of the center of the weather grid-cell which was used to generate this forecast. This coordinate might be a few kilometres away from the requested coordinate.'
		},
		elevation: {
			name: 'elevation',
			format: 'Floating point',
			description: elevationResponseDescription
		},
		generationtime_ms: {
			name: 'generationtime_ms',
			format: 'Floating point',
			description:
				'Generation time of the weather forecast in milliseconds. This is mainly used for performance monitoring and improvements.'
		},
		utc_offset_seconds: {
			name: 'utc_offset_seconds',
			format: 'Integer',
			description: utcOffsetSecondsResponseDescription
		},
		timezone: {
			name: ['timezone', 'timezone_abbreviation'],
			format: 'String',
			description: timezoneResponseDescription
		},
		current: { name: 'current', format: 'Object', description: currentResponseDescription },
		hourly: { name: 'hourly', format: 'Object', description: hourlyResponseDescription },
		hourly_units: {
			name: 'hourly_units',
			format: 'Object',
			description: 'For each selected weather variable, the unit will be listed here.'
		},
		daily: { name: 'daily', format: 'Object', description: dailyResponseDescription },
		daily_units: {
			name: 'daily_units',
			format: 'Object',
			description: 'For each selected daily weather variable, the unit will be listed here.'
		}
	} satisfies Record<string, ApiResponseParameter>;
</script>

{#snippet elevationResponseDescription()}
	The elevation from a 90 meter digital elevation model. This effects which grid-cell is selected
	(see parameter <mark>cell_selection</mark>). Statistical downscaling is used to adapt weather
	conditions for this elevation. This elevation can also be controlled with the query parameter
	<mark>elevation</mark>. If <mark>&elevation=nan</mark> is specified, all downscaling is disabled and
	the average grid-cell elevation is used.
{/snippet}

{#snippet utcOffsetSecondsResponseDescription()}
	UTC offset in seconds for the requested <mark>timezone</mark>, resolved when the request is made
	and kept fixed for the entire response, including across daylight saving time transitions.
{/snippet}

{#snippet timezoneResponseDescription()}
	Timezone identifier (e.g. <mark>Europe/Berlin</mark>) and abbreviation (e.g. <mark>CEST</mark>)
{/snippet}

{#snippet currentResponseDescription()}
	For every chosen current weather variable, the data is provided as a numeric value. In addition, <mark
		>time</mark
	>
	specifies the moment at which the data is valid. The <mark>interval</mark> represents the duration in
	seconds used for calculating backward-looking sums or averages. For instance, an interval of 900 seconds
	(15 minutes) means that aggregated metrics such as precipitation reflect the total from the previous
	15 minutes.
{/snippet}

{#snippet hourlyResponseDescription()}
	For each selected weather variable, data will be returned as a floating point array. Additionally
	a <mark>time</mark> array will be returned with ISO8601 timestamps.
{/snippet}

{#snippet dailyResponseDescription()}
	For each selected daily weather variable, data will be returned as a floating point array.
	Additionally a <mark>time</mark> array will be returned with ISO8601 timestamps.
{/snippet}
