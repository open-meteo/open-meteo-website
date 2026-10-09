<script module lang="ts">
	import { resolve } from '$app/paths';

	import type { ApiParameter } from './api-parameter-table.svelte';

	// Shared defaults and descriptions. Pages select supported parameters and override differences.
	export const apiParameters = {
		coordinates: {
			name: 'latitude, longitude',
			format: 'Floating point',
			required: true,
			defaultValue: '',
			description: coordinatesDescription
		},
		elevation: {
			name: 'elevation',
			format: 'Floating point',
			required: false,
			defaultValue: '',
			description: elevationDescription
		},
		hourly: {
			name: 'hourly',
			format: 'String array',
			required: false,
			defaultValue: '',
			description: hourlyDescription
		},
		daily: {
			name: 'daily',
			format: 'String array',
			required: false,
			defaultValue: '',
			description: dailyDescription
		},
		current: {
			name: 'current',
			format: 'String array',
			required: false,
			defaultValue: '',
			description: 'A list of weather variables to get current conditions.'
		},
		temperature_unit: {
			name: 'temperature_unit',
			format: 'String',
			required: false,
			defaultValue: 'celsius',
			description: temperatureUnitDescription
		},
		wind_speed_unit: {
			name: 'wind_speed_unit',
			format: 'String',
			required: false,
			defaultValue: 'kmh',
			description: windSpeedUnitDescription
		},
		precipitation_unit: {
			name: 'precipitation_unit',
			format: 'String',
			required: false,
			defaultValue: 'mm',
			description: precipitationUnitDescription
		},
		timeformat: {
			name: 'timeformat',
			format: 'String',
			required: false,
			defaultValue: 'iso8601',
			description: timeformatDescription
		},
		timezone: {
			name: 'timezone',
			format: 'String',
			required: false,
			defaultValue: 'GMT',
			description: timezoneDescription
		},
		past_days: {
			name: 'past_days',
			format: 'Integer',
			required: false,
			defaultValue: '0',
			description: pastDaysDescription
		},
		forecast_days: {
			name: 'forecast_days',
			format: 'Integer (0-16)',
			required: false,
			defaultValue: '7',
			description: 'Per default, only 7 days are returned. Up to 16 days of forecast are possible.'
		},
		forecast_hours_minutely_15: {
			name: ['forecast_hours', 'forecast_minutely_15', 'past_hours', 'past_minutely_15'],
			format: 'Integer (>0)',
			required: false,
			defaultValue: '',
			description:
				'Similar to forecast_days, the number of timesteps of hourly and 15-minutely data can controlled. Instead of using the current day as a reference, the current hour or the current 15-minute time-step is used.'
		},
		start_date: {
			name: ['start_date', 'end_date'],
			format: 'String (yyyy-mm-dd)',
			required: false,
			defaultValue: '',
			description: startDateDescription
		},
		start_hour_minutely_15: {
			name: ['start_hour', 'end_hour', 'start_minutely_15', 'end_minutely_15'],
			format: 'String (yyyy-mm-ddThh:mm)',
			required: false,
			defaultValue: '',
			description: startHourMinutely15Description
		},
		models: {
			name: 'models',
			format: 'String array',
			required: false,
			defaultValue: 'auto',
			description:
				'Manually select one or more weather models. Per default, the best suitable weather models will be combined.'
		},
		cell_selection: {
			name: 'cell_selection',
			format: 'String',
			required: false,
			defaultValue: 'land',
			description: cellSelectionDescription
		},
		apikey: {
			name: 'apikey',
			format: 'String',
			required: false,
			defaultValue: '',
			description: apikeyDescription
		},
		forecast_hours: {
			name: ['forecast_hours', 'past_hours'],
			format: 'Integer (>0)',
			required: false,
			defaultValue: '',
			description:
				'Similar to forecast_days, the number of timesteps of hourly data can controlled. Instead of using the current day as a reference, the current hour is used.'
		},
		start_hour: {
			name: ['start_hour', 'end_hour'],
			format: 'String (yyyy-mm-ddThh:mm)',
			required: false,
			defaultValue: '',
			description: startHourDescription
		}
	} satisfies Record<string, ApiParameter>;

	export const elevationWithoutMultipleLocationsDescription =
		elevationWithoutMultipleLocationsDescriptionSnippet;
	export const recentPastDaysDescription = recentPastDaysDescriptionSnippet;
</script>

{#snippet coordinatesDescription()}
	Geographical WGS84 coordinates of the location. Multiple coordinates can be comma separated. E.g. <mark
		>&latitude=52.52,48.85&longitude=13.41,2.35</mark
	>. To return data for multiple locations the JSON output changes to a list of structures. CSV and
	XLSX formats add a column <mark>location_id</mark>.
{/snippet}

{#snippet elevationDescription()}
	The elevation used for statistical downscaling. Per default, a <a
		class="text-link underline"
		href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
		title="Elevation based grid-cell selection explained"
		>90 meter digital elevation model is used</a
	>. You can manually set the elevation to correctly match mountain peaks. If
	<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses the average
	grid-cell height. For multiple locations, elevation can also be comma separated.
{/snippet}

{#snippet hourlyDescription()}
	A list of weather variables which should be returned. Values can be comma separated, or multiple <mark
		>&hourly=</mark
	> parameter in the URL can be used.
{/snippet}

{#snippet dailyDescription()}
	A list of daily weather variable aggregations which should be returned. Values can be comma
	separated, or multiple <mark>&daily=</mark> parameter in the URL can be used. If daily weather
	variables are specified, parameter <mark>timezone</mark> is required.
{/snippet}

{#snippet temperatureUnitDescription()}
	If <mark>fahrenheit</mark> is set, all temperature values are converted to Fahrenheit.
{/snippet}

{#snippet windSpeedUnitDescription()}
	Other wind speed units: <mark>ms</mark>, <mark>mph</mark> and <mark>kn</mark>
{/snippet}

{#snippet precipitationUnitDescription()}
	Other precipitation amount units: <mark>inch</mark>
{/snippet}

{#snippet timeformatDescription()}
	By default, timestamps use ISO 8601 format with a fixed offset, <mark>utc_offset_seconds</mark>,
	resolved at request time (see <mark>timezone</mark>). With <mark>unixtime</mark>, timestamps are
	seconds since 1970-01-01 00:00 UTC. To reproduce the API's dates and times, format them using
	<mark>utc_offset_seconds</mark>.
{/snippet}

{#snippet timezoneDescription()}
	The requested <mark>timezone</mark>'s UTC offset at request time is returned as
	<mark>utc_offset_seconds</mark>
	and used for ISO 8601 timestamps and daily boundaries throughout the response. Daylight saving time
	(DST) changes within the requested range are ignored. For DST-aware local times, request
	<mark>timeformat=unixtime</mark>
	and convert using the returned <mark>timezone</mark> in your application. Any name from the
	<a
		class="text-link underline"
		href="https://en.wikipedia.org/wiki/List_of_tz_database_time_zones"
		target="_blank">time zone database</a
	>
	is supported. <mark>auto</mark> resolves the time zone from the coordinates. For multiple coordinates,
	a comma separated list of time zones can be specified.
{/snippet}

{#snippet pastDaysDescription()}
	If <mark>past_days</mark> is set, past weather data can be returned.
{/snippet}

{#snippet startDateDescription()}
	The time interval to get weather data. A day must be specified as an ISO8601 date (e.g. <mark
		>2022-06-30</mark
	>).
{/snippet}

{#snippet startHourMinutely15Description()}
	The time interval to get weather data for hourly or 15 minutely data. Time must be specified as an
	ISO8601 date (e.g. <mark>2022-06-30T12:00</mark>).
{/snippet}

{#snippet cellSelectionDescription()}
	Set a preference how grid-cells are selected. The default <mark>land</mark> finds a suitable
	grid-cell on land with
	<a
		class="text-link underline"
		href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
		title="Elevation based grid-cell selection explained"
		>similar elevation to the requested coordinates using a 90-meter digital elevation model</a
	>. <mark>sea</mark> prefers grid-cells on sea. <mark>nearest</mark> selects the nearest possible grid-cell.
{/snippet}

{#snippet apikeyDescription()}
	Only required to commercial use to access reserved API resources for customers. The server URL
	requires the prefix <mark>customer-</mark>. See
	<a
		class="text-link underline"
		href={resolve('en/pricing')}
		title="Pricing information to use the weather API commercially">pricing</a
	> for more information.
{/snippet}

{#snippet startHourDescription()}
	The time interval to get weather data for hourly data. Time must be specified as an ISO8601 date
	(e.g. <mark>2022-06-30T12:00</mark>).
{/snippet}

{#snippet elevationWithoutMultipleLocationsDescriptionSnippet()}
	The elevation used for statistical downscaling. Per default, a <a
		class="text-link underline"
		href="https://openmeteo.substack.com/p/improving-weather-forecasts-with"
		title="Elevation based grid-cell selection explained"
		>90 meter digital elevation model is used</a
	>. You can manually set the elevation to correctly match mountain peaks. If
	<mark>&elevation=nan</mark> is specified, downscaling will be disabled and the API uses the average
	grid-cell height.
{/snippet}

{#snippet recentPastDaysDescriptionSnippet()}
	If <mark>past_days</mark> is set, yesterday or the day before yesterday data are also returned.
{/snippet}
