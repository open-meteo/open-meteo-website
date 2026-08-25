import type { Parameters } from '$lib/docs';

/// Parameters that come from the API key settings or the preview itself, not from the form
const IGNORED_PARAMETERS = ['apikey', 'format'];

/// Per location values that are encoded in the coordinates list instead of a form field
const CSV_COLUMNS = ['elevation', 'timezone', 'start_date', 'end_date'];

/// `api.open-meteo.com` → `forecast`, `air-quality-api.open-meteo.com` → `air-quality`.
/// Self hosted servers can not be mapped to a type and return undefined.
export const serverType = (hostname: string): string | undefined => {
	const suffix = '.open-meteo.com';
	if (!hostname.endsWith(suffix)) {
		return undefined;
	}
	const prefix = hostname.slice(0, -suffix.length).replace(/^customer-/, '');
	if (prefix === 'api') {
		return 'forecast';
	}
	return prefix.endsWith('-api') ? prefix.slice(0, -'-api'.length) : undefined;
};

const values = (search: URLSearchParams, key: string): string[] => {
	const value = search.get(key);
	return value ? value.split(',') : [];
};

/// Multiple locations are edited as a coordinates list:
/// `latitude,longitude,elevation,timezone,start_date,end_date` per line
const coordinatesToCsv = (search: URLSearchParams): string => {
	const latitudes = values(search, 'latitude');
	const longitudes = values(search, 'longitude');
	// a single value applies to all locations and stays a regular parameter
	const columns = CSV_COLUMNS.map((key) => {
		const column = values(search, key);
		return column.length > 1 ? column : [];
	});
	return latitudes
		.map((latitude, index) => {
			const row = [latitude, longitudes[index] ?? '', ...columns.map((c) => c[index] ?? '')];
			while (row.length > 2 && row.at(-1) === '') {
				row.pop();
			}
			return row.join(',');
		})
		.join('\n');
};

export interface ApiUrlOptions {
	/// Current parameters, base for keys the page has no default for, like latitude
	current: Parameters;
	/// Page defaults, everything the URL does not carry falls back to these
	defaults: Parameters;
	/// Endpoint of the page, as used to build the API URL
	type: string;
	action: string;
	/// Model that the page applies implicitly when no model is selected
	model_default?: string;
}

export interface ApiUrlResult {
	params?: Parameters;
	error?: string;
}

/// Reverse of the API URL built in the results preview: turns a pasted URL back
/// into the parameters of the page, including the location, time and API modes
/// that are only implied by the URL.
export const parseApiUrl = (input: string, options: ApiUrlOptions): ApiUrlResult => {
	const { current, defaults, type, action, model_default } = options;

	let url: URL;
	try {
		url = new URL(input.trim());
	} catch {
		return { error: 'Not a valid URL' };
	}
	if (url.protocol !== 'https:' && url.protocol !== 'http:') {
		return { error: 'Not a valid URL' };
	}

	const hasApiMode = 'api_mode' in current;
	const urlType = serverType(url.hostname);
	const urlAction =
		url.pathname
			.split('/')
			.filter((part) => part !== '')
			.at(-1) ?? '';

	// self hosted servers carry no type, everything else must match this page
	if (urlType !== undefined) {
		const apiModeTypes = hasApiMode ? ['historical-forecast', 'single-runs'] : [];
		const expectedAction = urlType === type ? action : 'forecast';
		if (![type, ...apiModeTypes].includes(urlType) || urlAction !== expectedAction) {
			return { error: `This URL is for a different API endpoint (${url.host}${url.pathname})` };
		}
	}

	// start from the defaults, so parameters missing in the URL are reset
	const params: Parameters = {};
	for (const key of new Set([...Object.keys(current), ...Object.keys(defaults)])) {
		const value = key in defaults ? defaults[key] : current[key];
		params[key] = Array.isArray(value) ? [...value] : value;
	}

	const search = url.searchParams;
	for (const [key, value] of search.entries()) {
		if (IGNORED_PARAMETERS.includes(key)) {
			continue;
		}
		const reference = key in defaults ? defaults[key] : current[key];
		params[key] = Array.isArray(reference) ? value.split(',').filter((e) => e !== '') : value;
	}

	// a model that is only implicit in the URL stays implicit in the form
	if (
		model_default &&
		Array.isArray(defaults.models) &&
		defaults.models.length === 0 &&
		params.models?.length === 1 &&
		params.models[0] === model_default
	) {
		params.models = [];
	}

	if (hasApiMode) {
		params.api_mode =
			urlType === 'historical-forecast'
				? 'historical_forecast'
				: urlType === 'single-runs' || (urlType === undefined && search.has('run'))
					? 'single_run'
					: 'forecast';
		if (params.api_mode !== 'single_run') {
			params.run = '';
		}
	}

	if ('location_mode' in params) {
		if (search.has('bounding_box')) {
			params.location_mode = 'bounding_box';
		} else if (values(search, 'latitude').length > 1) {
			params.location_mode = 'csv_coordinates';
			params.csv_coordinates = coordinatesToCsv(search);
			for (const key of CSV_COLUMNS) {
				if (values(search, key).length > 1) {
					params[key] = defaults[key];
				}
			}
		} else {
			params.location_mode = 'location_search';
		}
	}

	if ('time_mode' in params) {
		params.time_mode =
			params.api_mode === 'historical_forecast' ||
			params.api_mode === 'single_run' ||
			(params.start_date && params.end_date)
				? 'time_interval'
				: 'forecast_days';
	}

	return { params };
};
