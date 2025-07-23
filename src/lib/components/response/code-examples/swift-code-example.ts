import type { Parameters } from '$lib/docs';
import { titleCase } from '$lib/utils';

import { INT_64_VARIABLES } from '$lib/constants';

export const swiftCodeExample = (
	parsedParams: Parameters,
	multipleLocationsOrModels: boolean,
	numberOfLocations: number | string,
	numberOfModels: number,
	server: string,
	sdk_type: string
) => {
	let c = `
import OpenMeteoSdk
/// Make sure the URL contains '&format=flatbuffers'
let url = URL(string: "https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=weather_code,sunrise&hourly=temperature_2m,weather_code&current=temperature_2m,precipitation&format=flatbuffers")!
let responses = try await WeatherApiResponse.fetch(url: url)
/// Process first location. Add a for-loop for multiple locations or weather models
let response = responses[0]
/// Attributes for timezone and location
let utcOffsetSeconds = response.utcOffsetSeconds
let timezone = response.timezone
let timezoneAbbreviation = response.timezoneAbbreviation
let latitude = response.latitude
let longitude = response.longitude
let current = response.current!
let hourly = response.hourly!
let daily = response.daily!
struct WeatherData {
	let current: Current
	let hourly: Hourly
	let daily: Daily
	struct Current {
		let time: Date
		let temperature2m: Float
		let precipitation: Float
	}
	struct Hourly {
		let time: [Date]
		let temperature2m: [Float]
		let weatherCode: [Float]
	}
	struct Daily {
		let time: [Date]
		let weatherCode: [Float]
		let sunrise: [Int64]
	}
}
/// Note: The order of weather variables in the URL query and the 'at' indices below need to match!
let data = WeatherData(
	current: .init(
		time: Date(timeIntervalSince1970: TimeInterval(current.time + Int64(utcOffsetSeconds))),
		temperature2m: current.variables(at: 0)!.value,
		precipitation: current.variables(at: 1)!.value
	),
	hourly: .init(
		time: hourly.getDateTime(offset: utcOffsetSeconds),
		temperature2m: hourly.variables(at: 0)!.values,
		weatherCode: hourly.variables(at: 1)!.values
	),
	daily: .init(
		time: daily.getDateTime(offset: utcOffsetSeconds),
		weatherCode: daily.variables(at: 0)!.values,
		sunrise: daily.variables(at: 1)!.valuesInt64
	)
)
/// Timezone '.gmt' is deliberately used.
/// By adding 'utcOffsetSeconds' before, local-time is inferred
let dateFormatter = DateFormatter()
dateFormatter.timeZone = .gmt
dateFormatter.dateFormat = "yyyy-MM-dd HH:mm"
for (i, date) in data.hourly.time.enumerated() {
	print(dateFormatter.string(from: date))
	print(data.hourly.temperature2m[i])
	print(data.hourly.weatherCode[i])
}
for (i, date) in data.daily.time.enumerated() {
	print(dateFormatter.string(from: date))
	print(data.daily.weatherCode[i])
	print(data.daily.sunrise[i])
}`;
	return c;
};
