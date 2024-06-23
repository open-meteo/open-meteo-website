import Highcharts from 'highcharts/es-modules/Core/Globals.js';
import Utilities from 'highcharts/es-modules/Core/Utilities.js';
import Defaults from 'highcharts/es-modules/Core/Defaults.js';
// import Fx from 'highcharts/es-modules/Core/Animation/Fx.js';
// import Animation from 'highcharts/es-modules/Core/Animation/AnimationUtilities.js';
// import AST from 'highcharts/es-modules/Core/Renderer/HTML/AST.js';
// import Templating from 'highcharts/es-modules/Core/Templating.js';
// import RendererUtilities from 'highcharts/es-modules/Core/Renderer/RendererUtilities.js';
import SVGElement from 'highcharts/es-modules/Core/Renderer/SVG/SVGElement.js';
import SVGRenderer from 'highcharts/es-modules/Core/Renderer/SVG/SVGRenderer.js';
// import HTMLElement from 'highcharts/es-modules/Core/Renderer/HTML/HTMLElement.js';
// import HTMLRenderer from 'highcharts/es-modules/Core/Renderer/HTML/HTMLRenderer.js';
import Axis from 'highcharts/es-modules/Core/Axis/Axis.js';
import DateTimeAxis from 'highcharts/es-modules/Core/Axis/DateTimeAxis.js';
// import LogarithmicAxis from 'highcharts/es-modules/Core/Axis/LogarithmicAxis.js';
import PlotLineOrBand from 'highcharts/es-modules/Core/Axis/PlotLineOrBand/PlotLineOrBand.js';
// import Tick from 'highcharts/es-modules/Core/Axis/Tick.js';
import Tooltip from 'highcharts/es-modules/Core/Tooltip.js';
// import Point from 'highcharts/es-modules/Core/Series/Point.js';
import Pointer from 'highcharts/es-modules/Core/Pointer.js';
import Legend from 'highcharts/es-modules/Core/Legend/Legend.js';
import Chart from 'highcharts/es-modules/Core/Chart/Chart.js';
// import 'highcharts/es-modules/Extensions/ScrollablePlotArea.js';
import StackingAxis from 'highcharts/es-modules/Core/Axis/Stacking/StackingAxis.js';
import StackItem from 'highcharts/es-modules/Core/Axis/Stacking/StackItem.js';
import Series from 'highcharts/es-modules/Core/Series/Series.js';
import SeriesRegistry from 'highcharts/es-modules/Core/Series/SeriesRegistry.js';
import 'highcharts/es-modules/Series/Line/LineSeries.js';
import 'highcharts/es-modules/Series/Area/AreaSeries.js';
// import 'highcharts/es-modules/Series/Spline/SplineSeries.js';
// import 'highcharts/es-modules/Series/AreaSpline/AreaSplineSeries.js';
import ColumnSeries from 'highcharts/es-modules/Series/Column/ColumnSeries.js';
import ColumnDataLabel from 'highcharts/es-modules/Series/Column/ColumnDataLabel.js';
import 'highcharts/es-modules/Series/Bar/BarSeries.js';
// import 'highcharts/es-modules/Series/Scatter/ScatterSeries.js';
// import PieSeries from 'highcharts/es-modules/Series/Pie/PieSeries.js';
// import PieDataLabel from 'highcharts/es-modules/Series/Pie/PieDataLabel.js';
import DataLabel from 'highcharts/es-modules/Core/Series/DataLabel.js';
// import OverlappingDataLabels from 'highcharts/es-modules/Extensions/OverlappingDataLabels.js';
// import BorderRadius from 'highcharts/es-modules/Extensions/BorderRadius.js';
import Responsive from 'highcharts/es-modules/Core/Responsive.js';
// import Color from 'highcharts/es-modules/Core/Color/Color.js';
import Time from 'highcharts/es-modules/Core/Time.js';
const G = Highcharts;
// Animation
// G.animate = Animation.animate;
// G.animObject = Animation.animObject;
// G.getDeferredAnimation = Animation.getDeferredAnimation;
// G.setAnimation = Animation.setAnimation;
// G.stop = Animation.stop;
// G.timers = Fx.timers;
// Classes
// G.AST = AST;
G.Axis = Axis;
G.Chart = Chart;
G.chart = Chart.chart;
// G.Fx = Fx;
G.Legend = Legend;
G.PlotLineOrBand = PlotLineOrBand;
// G.Point = Point;
G.Pointer = Pointer;
G.Series = Series;
G.StackItem = StackItem;
G.SVGElement = SVGElement;
G.SVGRenderer = SVGRenderer;
// G.Templating = Templating;
// G.Tick = Tick;
G.Time = Time;
G.Tooltip = Tooltip;
// Color
// G.Color = Color;
// G.color = Color.parse;
// Compositions
// HTMLRenderer.compose(SVGRenderer);
// HTMLElement.compose(SVGElement);
Pointer.compose(Chart);
Legend.compose(Chart);
// DefaultOptions
G.defaultOptions = Defaults.defaultOptions;
G.getOptions = Defaults.getOptions;
G.time = Defaults.defaultTime;
G.setOptions = Defaults.setOptions;
// Format Utilities
// G.dateFormat = Templating.dateFormat;
// G.format = Templating.format;
// G.numberFormat = Templating.numberFormat;
// Utilities
Utilities.extend(G, Utilities);
// G.distribute = RendererUtilities.distribute;
G.seriesType = SeriesRegistry.seriesType;
// Compositions
ColumnDataLabel.compose(ColumnSeries);
// BorderRadius.compose(Series, PieSeries, SVGElement, SVGRenderer);
DataLabel.compose(Series);
DateTimeAxis.compose(Axis);
// LogarithmicAxis.compose(Axis);
// OverlappingDataLabels.compose(Chart);
// PieDataLabel.compose(PieSeries);
PlotLineOrBand.compose(Axis);
Responsive.compose(Chart);
StackingAxis.compose(Axis, Chart, Series);
Tooltip.compose(Pointer);



//import './broken-axis.src.js';
// import BrokenAxis from 'highcharts/es-modules/Core/Axis/BrokenAxis.js';
// Compositions
// BrokenAxis.compose(G.Axis, G.Series);

//import './datagrouping.src.js';
import ApproximationDefaults from 'highcharts/es-modules/Extensions/DataGrouping/ApproximationDefaults.js';
import ApproximationRegistry from 'highcharts/es-modules/Extensions/DataGrouping/ApproximationRegistry.js';
import DataGrouping from 'highcharts/es-modules/Extensions/DataGrouping/DataGrouping.js';
G.dataGrouping = {
    approximationDefaults: ApproximationDefaults,
    approximations: ApproximationRegistry
};
DataGrouping.compose(G.Axis, G.Series, G.Tooltip);


//import './mouse-wheel-zoom.src.js';
// import DataModifyComposition from 'highcharts/es-modules/Series/DataModifyComposition.js';
// import Navigator from 'highcharts/es-modules/Stock/Navigator/Navigator.js';
// import RangeSelector from 'highcharts/es-modules/Stock/RangeSelector/RangeSelector.js';
// import Scrollbar from 'highcharts/es-modules/Stock/Scrollbar/Scrollbar.js';
// import OrdinalAxis from 'highcharts/es-modules/Core/Axis/OrdinalAxis.js';
// import 'highcharts/es-modules/Series/HLC/HLCSeries.js';
// import OHLCSeries from 'highcharts/es-modules/Series/OHLC/OHLCSeries.js';
// import 'highcharts/es-modules/Series/Candlestick/CandlestickSeries.js';
// import FlagsSeries from 'highcharts/es-modules/Series/Flags/FlagsSeries.js';
import StockChart from 'highcharts/es-modules/Core/Chart/StockChart.js';
// Classes
// G.Navigator = Navigator;
// G.RangeSelector = RangeSelector;
// G.Scrollbar = Scrollbar;
G.StockChart = G.stockChart = StockChart;
// Compositions
// DataModifyComposition.compose(G.Series, G.Axis, G.Point);
// FlagsSeries.compose(G.Renderer);
// Navigator.compose(G.Axis, G.Chart, G.Series);
// OHLCSeries.compose(G.Series);
// OrdinalAxis.compose(G.Axis, G.Series, G.Chart);
// RangeSelector.compose(G.Axis, G.Chart);
// Scrollbar.compose(G.Axis);
G.StockChart.compose(G.Chart, G.Axis, G.Series, G.SVGRenderer);




// Default Export
export default G;
// export {Chart};
//export {G as default};