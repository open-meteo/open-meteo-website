import Highcharts from 'highcharts/es-modules/Core/Globals.js';
import Utilities from 'highcharts/es-modules/Core/Utilities.js';
import Defaults from 'highcharts/es-modules/Core/Defaults.js';
import SVGElement from 'highcharts/es-modules/Core/Renderer/SVG/SVGElement.js';
import SVGRenderer from 'highcharts/es-modules/Core/Renderer/SVG/SVGRenderer.js';
import Axis from 'highcharts/es-modules/Core/Axis/Axis.js';
import DateTimeAxis from 'highcharts/es-modules/Core/Axis/DateTimeAxis.js';
import PlotLineOrBand from 'highcharts/es-modules/Core/Axis/PlotLineOrBand/PlotLineOrBand.js';
import Tooltip from 'highcharts/es-modules/Core/Tooltip.js';
import Pointer from 'highcharts/es-modules/Core/Pointer.js';
import Legend from 'highcharts/es-modules/Core/Legend/Legend.js';
import Chart from 'highcharts/es-modules/Core/Chart/Chart.js';
import StackingAxis from 'highcharts/es-modules/Core/Axis/Stacking/StackingAxis.js';
import StackItem from 'highcharts/es-modules/Core/Axis/Stacking/StackItem.js';
import Series from 'highcharts/es-modules/Core/Series/Series.js';
import SeriesRegistry from 'highcharts/es-modules/Core/Series/SeriesRegistry.js';
import 'highcharts/es-modules/Series/Line/LineSeries.js';
import 'highcharts/es-modules/Series/Area/AreaSeries.js';
import 'highcharts/es-modules/Series/Column/ColumnSeries.js';
import ColumnDataLabel from 'highcharts/es-modules/Series/Column/ColumnDataLabel.js';
import DataLabel from 'highcharts/es-modules/Core/Series/DataLabel.js';
import Responsive from 'highcharts/es-modules/Core/Responsive.js';
import Time from 'highcharts/es-modules/Core/Time.js';

const G: AnyRecord = Highcharts;

// Classes
G.Axis = Axis;
G.Chart = Chart;
G.DataLabel = DataLabel;
G.HTMLElement = HTMLElement;
G.Legend = Legend;
G.PlotLineOrBand = PlotLineOrBand;
G.Pointer = Pointer;
G.Series = Series;
G.SeriesRegistry = SeriesRegistry;
G.StackItem = StackItem;
G.SVGElement = SVGElement;
G.SVGRenderer = SVGRenderer;
G.Time = Time;
G.Tooltip = Tooltip;

// Utilities
G.chart = Chart.chart;
G.defaultOptions = Defaults.defaultOptions;
G.getOptions = Defaults.getOptions;
G.seriesType = SeriesRegistry.seriesType;
G.setOptions = Defaults.setOptions;
G.time = Defaults.defaultTime;

// Compositions
ColumnDataLabel.compose(G.Series.types.column);
DataLabel.compose(G.Series);
DateTimeAxis.compose(G.Axis);
Legend.compose(G.Chart);
PlotLineOrBand.compose(G.Chart, G.Axis);
Pointer.compose(G.Chart);
Responsive.compose(G.Chart);
StackingAxis.compose(G.Axis, G.Chart, G.Series);
Tooltip.compose(G.Pointer);
Utilities.extend(G, Utilities);

// Data grouping
import ApproximationDefaults from 'highcharts/es-modules/Extensions/DataGrouping/ApproximationDefaults.js';
import ApproximationRegistry from 'highcharts/es-modules/Extensions/DataGrouping/ApproximationRegistry.js';
import DataGrouping from 'highcharts/es-modules/Extensions/DataGrouping/DataGrouping.js';
G.dataGrouping = {
	approximationDefaults: ApproximationDefaults,
	approximations: ApproximationRegistry
};
DataGrouping.compose(G.Axis, G.Series, G.Tooltip);

// Stockchart
import StockChart from 'highcharts/es-modules/Core/Chart/StockChart.js';
G.StockChart = G.stockChart = StockChart;
G.StockChart.compose(G.Chart, G.Axis, G.Series, G.SVGRenderer);

// Default Export
export default G;
