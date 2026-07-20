import { getWeatherCode } from '$lib/utils/meteo';
import { getWeatherIconName } from '$lib/utils/weather-codes';

import { SECTIONS } from '$lib/constants';

import type { AxisPlotBandsOptions, SeriesOptionsType, YAxisOptions } from 'highcharts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsonToChart(data: any, downloadTime: number) {
	const yAxis: YAxisOptions[] = [];

	const series: SeriesOptionsType[] = [];
	SECTIONS.forEach(function (section) {
		if (!(section in data) || section === 'current') {
			return;
		}
		Object.entries(data[section] || []).forEach(function (k) {
			if (k[0] == 'time' || k[0] == 'sunrise' || k[0] == 'sunset') {
				return;
			}
			if (k[0] == 'weather_code') {
				return;
			}
			const hourly_starttime = (data[section].time[0] + data.utc_offset_seconds) * 1000;
			// Single-point responses have no second timestamp; fall back to one hour
			const pointInterval =
				data[section].time.length > 1
					? (data[section].time[1] - data[section].time[0]) * 1000
					: 3600 * 1000;
			const unit = data[`${section}_units`][k[0]];
			let axisId = null;
			for (let i = 0; i < yAxis.length; i++) {
				if (yAxis[i].title?.text == unit) {
					axisId = i;
				}
			}
			if (axisId == null) {
				yAxis.push({ title: { text: unit } });
				axisId = yAxis.length - 1;
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const ser: any = {
				name: k[0],
				data: k[1],
				yAxis: axisId,
				pointStart: hourly_starttime,
				pointInterval: pointInterval,
				type: unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²' ? 'column' : 'line',
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
					const condition = getWeatherCode(this.y);
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
	});

	let plotBands: AxisPlotBandsOptions[] = [];
	if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
		const rise = data.daily.sunrise;
		const set = data.daily.sunset;
		plotBands = rise.map(function (r: number, i: number) {
			return {
				color: 'rgb(255, 255, 194)',
				from: (r + data.utc_offset_seconds) * 1000,
				to: (set[i] + data.utc_offset_seconds) * 1000
			};
		});
	}

	const weatherIconPoints: { x: number; icon: string }[] = [];
	if ('hourly' in data && 'weather_code' in data.hourly) {
		const codes: number[] = data.hourly.weather_code;
		const times: number[] = data.hourly.time;
		const interval = times.length > 1 ? times[1] - times[0] : 3600;
		// Show at most one icon every 6 hours to avoid crowding
		const sampleEvery = Math.max(1, Math.round((1 * 3600) / interval));
		const rises: number[] = data.daily?.sunrise ?? [];
		const sets: number[] = data.daily?.sunset ?? [];
		for (let i = 0; i < codes.length; i += sampleEvery) {
			const t = times[i];
			const daytime =
				rises.length === 0 || rises.some((r: number, d: number) => t >= r && t <= sets[d]);
			weatherIconPoints.push({
				x: (t + data.utc_offset_seconds) * 1000,
				icon: getWeatherIconName(codes[i], daytime)
			});
		}
	}

	const latitude = data.latitude.toFixed(2);
	const longitude = data.longitude.toFixed(2);
	let title = `${latitude}°N ${longitude}°E`;

	if ('elevation' in data) {
		const elevation = data.elevation.toFixed(0);
		title = `${title} ${elevation}m above sea level`;
	}
	const generationtime_ms = data.generationtime_ms.toFixed(2);

	const utc_offset_sign = data.utc_offset_seconds < 0 ? '' : '+';

	const json = {
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
			},
			...(weatherIconPoints.length > 0
				? {
						events: {
							render: function () {
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								const chart = this as any;
								if (chart._weatherIconEls) {
									for (const el of chart._weatherIconEls) el.destroy();
								}
								chart._weatherIconEls = [];
								const iconSize = 26;
								const xAxis = chart.xAxis[0];
								const minSpacing = iconSize - 4;
								let lastPx = -Infinity;
								for (const pt of weatherIconPoints) {
									if (pt.x < xAxis.min || pt.x > xAxis.max) continue;
									const px = xAxis.toPixels(pt.x, false);
									if (px - lastPx < minSpacing) continue;
									lastPx = px;
									chart._weatherIconEls.push(
										chart.renderer
											.image(
												`/images/weather-icons/${pt.icon}.svg`,
												px - iconSize / 2,
												chart.plotTop + 4,
												iconSize,
												iconSize
											)
											.attr({ zIndex: 5 })
											.add()
									);
								}
							}
						}
					}
				: {})
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
