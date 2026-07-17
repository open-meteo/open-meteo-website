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
