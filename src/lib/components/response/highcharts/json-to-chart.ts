import { getWeatherCode } from "$lib/utils/meteo";

export function jsonToChart(data: any, downloadTime: number) {
	let yAxis: any = [];

	let series: any = [];
	['hourly', 'six_hourly', 'three_hourly', 'daily', 'minutely_15'].forEach(
		function (section, index) {
			if (!(section in data)) {
				return;
			}
			Object.entries(data[section] || []).forEach(function (k) {
				if (k[0] == 'time' || k[0] == 'sunrise' || k[0] == 'sunset') {
					return;
				}
				let hourly_starttime = (data[section].time[0] + data.utc_offset_seconds) * 1000;
				let pointInterval = (data[section].time[1] - data[section].time[0]) * 1000;
				let unit = data[`${section}_units`][k[0]];
				let axisId = null;
				for (let i = 0; i < yAxis.length; i++) {
					if (yAxis[i].title.text == unit) {
						axisId = i;
					}
				}
				if (axisId == null) {
					yAxis.push({ title: { text: unit } });
					axisId = yAxis.length - 1;
				}
				let ser = {
					name: k[0],
					data: k[1],
					yAxis: axisId,
					pointStart: hourly_starttime,
					pointInterval: pointInterval,
					type:
						unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²' ? 'column' : 'line',
					tooltip: {
						valueSuffix: ' ' + unit
					},
					dataGrouping: {
						groupPixelWidth: 8,
						units: [
							['minute', [1, 2, 5, 10, 15]],
							['hour', [1]],
							['day', [1]],
							['week', [1]],
							['month', [1, 3, 6]],
							['year', null]
						]
					}
				};

				if (k[0] == 'weather_code') {
					ser.tooltip.pointFormatter = function () {
						let condition = getWeatherCode(this.y);
						return (
							'<span style="color:' +
							this.series.color +
							'">\u25CF</span> ' +
							this.series.name +
							': <b>' +
							condition +
							'</b> (' +
							this.y +
							' wmo)<br/>'
						);
					};
				}

				series.push(ser);
			});
		}
	);

	let plotBands: any = [];
	if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
		let rise = data.daily.sunrise;
		let set = data.daily.sunset;
		plotBands = rise.map(function (r, i) {
			return {
				color: 'rgb(255, 255, 194)',
				from: (r + data.utc_offset_seconds) * 1000,
				to: (set[i] + data.utc_offset_seconds) * 1000
			};
		});
	}

	let latitude = data.latitude.toFixed(2);
	let longitude = data.longitude.toFixed(2);
	let title = `${latitude}°N ${longitude}°E`;

	if ('elevation' in data) {
		let elevation = data.elevation.toFixed(0);
		title = `${title} ${elevation}m above sea level`;
	}
	let generationtime_ms = data.generationtime_ms.toFixed(2);

	let utc_offset_sign = data.utc_offset_seconds < 0 ? '' : '+';

	let json = {
		title: {
			text: title
		},

		subtitle: {
			text: `Generated in ${generationtime_ms}ms, downloaded in ${downloadTime.toFixed(
				0
			)}ms, time in GMT${utc_offset_sign}${data.utc_offset_seconds / 3600}`
		},

		chart: {
			zoomType: 'x',
			zooming: {
				mouseWheel: {
					enabled: false
				}
			}
		},

		yAxis: yAxis,

		xAxis: {
			type: 'datetime',
			plotLines: [
				{
					value: Date.now() + data.utc_offset_seconds * 1000,
					color: 'red',
					width: 2
				}
			],
			plotBands: plotBands
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
				}
			}
		},

		series: series,

		responsive: {
			rules: [
				{
					condition: {
						maxWidth: 800
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
		},
		tooltip: {
			shared: series.length <= 5,
			animation: false
		}
	};
	return json;
}
