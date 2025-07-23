import type { Parameters } from '$lib/docs';
import { capitalizeFirstLetter } from '$lib/utils/meteo';

export const pythonCodeExample = (
	parsedParams: Parameters,
	processMultipleLocations: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	int64Variables: string[],
	sdk_type: string
) => {
	const p = processMultipleLocations;
	let c = '';
	// imports python
	c += `import openmeteo_requests

import pandas as pd
import requests_cache
from retry_requests import retry`;

	// setup cache
	c += `\n\n# Setup the Open-Meteo API client with cache and retry on error
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)`;

	// set params and request
	c += `

# Make sure all required weather variables are listed here
# The order of variables in hourly or daily is important to assign them correctly below
url = "${server}"
params = {`;
	for (const [key, param] of Object.entries(parsedParams)) {
		if (param.constructor === Array) {
			if (typeof param[0] === 'string') {
				c += `
	"${key}": [${'"' + param.join('", "') + '"'}],`;
			} else {
				c += `
	"${key}": [${param.join(', ')}],`;
			}
		} else if (typeof param == 'object') {
			/// ???
		} else if (typeof param == 'string') {
			c += `
	"${key}": "${param}",`;
		} else {
			c += `
	"${key}": ${param},`;
		}
	}
	c += `
}
responses = openmeteo.weather_api(url, params=params)

# Process first location. Add a for-loop for multiple locations or weather models
response = responses[0]
print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
print(f"Elevation {response.Elevation()} m asl")
print(f"Timezone {response.Timezone()}{response.TimezoneAbbreviation()}")
print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")`;

	if (parsedParams.current) {
		c += `

# Current values. The order of variables needs to be the same as requested.
current = response.Current()`;
		if (parsedParams.current.constructor === Array) {
			for (const [ind, cur] of parsedParams.current.entries()) {
				c += `
current_${cur} = current.Variables(${ind}).Value()`;
			}
		} else {
			c += `
current_${parsedParams.current} = current.Variables(0).Value()`;
		}
		c += `

print(f"Current time {current.Time()}")`;
		if (parsedParams.current.constructor === Array) {
			for (const cur of parsedParams.current) {
				c += `
print(f"Current ${cur} {current_${cur}}")`;
			}
		} else {
			c += `
print(f"Current ${parsedParams.current} {current_${parsedParams.current}}")`;
		}
	}
	for (const section of ['hourly', 'daily']) {
		const sect = parsedParams[section];
		if (sect) {
			c += `

# Process ${section} data. The order of variables needs to be the same as requested.
${section} = response.${capitalizeFirstLetter(section)}()`;
			if (sect.constructor === Array) {
				for (const [ind, variable] of sect.entries()) {
					c += `
${section}_${variable} = ${section}.Variables(${ind}).${int64Variables.includes(variable) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}()`;
				}
			} else {
				c += `
${section}_${sect} = ${section}.Variables(0).${int64Variables.includes(sect) ? 'ValuesInt64AsNumpy' : 'ValuesAsNumpy'}()`;
			}
			c += `

${section}_data = {"date": pd.date_range(
	start = pd.to_datetime(${section}.Time(), unit = "s", utc = True),
	end = pd.to_datetime(${section}.TimeEnd(), unit = "s", utc = True),
	freq = pd.Timedelta(seconds = ${section}.Interval()),
	inclusive = "left"
)}
`;
			if (sect.constructor === Array) {
				for (const variable of sect) {
					c += `
${section}_data["${variable}"] = ${section}_${variable}`;
				}
			} else {
				c += `
${section}_data["${sect}"] = ${section}_${sect}`;
			}

			c += `

${section}_dataframe = pd.DataFrame(data = ${section}_data)
print("\\n${capitalizeFirstLetter(section)} data\\n", ${section}_dataframe)`;
		}
	}

	return c;
};
