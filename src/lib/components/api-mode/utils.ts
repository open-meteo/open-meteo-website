// Form action for pages with an api_mode switch (Forecast / Historical Forecast / Single Run)
export const apiModeFormAction = (apiMode: string | undefined, forecastAction: string): string => {
	if (apiMode === 'historical_forecast') {
		return 'https://historical-forecast-api.open-meteo.com/v1/forecast';
	}
	if (apiMode === 'single_run') {
		return 'https://single-runs-api.open-meteo.com/v1/forecast';
	}
	return forecastAction;
};

const isoDate = (daysAgo: number): string => {
	const d = new Date();
	d.setDate(d.getDate() - daysAgo);
	return d.toISOString().split('T')[0];
};

// Start/end dates carried over into Historical Forecast mode, clamped to the
// archive coverage so dates picked in the forecast window stay valid
export const historicalDateRange = (
	start: string | undefined,
	end: string | undefined
): { start_date: string; end_date: string } => {
	const minStart = '2016-01-01';
	const maxEnd = isoDate(2);
	let end_date = end && end < maxEnd ? end : maxEnd;
	let start_date = start ? start : isoDate(16);
	if (start_date < minStart) {
		start_date = minStart;
	}
	if (start_date > end_date) {
		start_date = end_date;
	}
	return { start_date, end_date };
};
