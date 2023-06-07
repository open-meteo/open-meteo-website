import $ from "jquery";
import Highcharts from 'highcharts/highstock';
import HighchartsAccessibility from "highcharts/modules/accessibility";
//import HighchartsBoost from "highcharts/modules/boost";

HighchartsAccessibility(Highcharts);
//HighchartsBoost(Highcharts);

//import Dropdown from "bootstrap/js/src/dropdown"


function updateCheckboxCounter(counter, countOf) {
    var countAll = 0;
    var countChecked = 0;
    countOf.querySelectorAll("input[type=checkbox]").forEach(function(element) {
        countAll += 1;
        countChecked += element.checked ? 1 : 0
    });
    counter.innerHTML = `${countChecked} / ${countAll}`;
    counter.style.display = countChecked == 0 ? "none" : "";
}
function setupCheckboxCounter() {
    document.querySelectorAll('.checkboxcounter').forEach(function(counter) {
        const countOf = document.querySelector(counter.dataset.countCheckboxesOf);
        updateCheckboxCounter(counter, countOf);
        countOf.querySelectorAll("input[type=checkbox]").forEach(function(element) {
            element.addEventListener('change', (event) => {
                updateCheckboxCounter(counter, countOf);
            })
        });
    })
}

function previewData(data, downloadTime) {
    var yAxis = [];
    let codes = {0: "fair", 1: "mainly clear", 2: "partly cloudy", 3: "overcast", 45: "fog", 
        48: "depositing rime fog", 51: "light drizzle", 53: "moderate drizzle", 55: "dense drizzle", 
        56: "light freezing drizzle", 57: "dense freezing drizzle", 61: "slight rain", 63: "moderate rain", 
        65: "heavy rain", 66: "light freezing rain", 67: "heavy freezing rain", 71: "slight snow fall", 
        73: "moderate snow fall", 75: "heavy snow fall", 77: "snow grains", 80: "slight rain showers", 
        81: "moderate rain showers", 82: "heavy rain showers", 85: "slight snow showers", 86: "heavy snow showers",
        95: "slight to moderate thunderstorm", 96: "thunderstorm with slight hail", 99: "thunderstorm with heavy hail"
    };

    var series = [];
    ["hourly", "six_hourly", "three_hourly", "daily", "minutely_15"].forEach(function (section, index) {
        if (!(section in data)) {
            return
        }
        Object.entries(data[section]||[]).forEach(function(k){
            if (k[0] == "time" || k[0] == "sunrise" || k[0] == "sunset") {
                return
            }
            let hourly_starttime = (data[section].time[0] + data.utc_offset_seconds) * 1000;
            let pointInterval = (data[section].time[1] - data[section].time[0]) * 1000;
            let unit = data[`${section}_units`][k[0]];
            var axisId = null;
            for (let i = 0; i < yAxis.length; i++) {
                if (yAxis[i].title.text == unit) {
                    axisId = i;
                }
            }
            if (axisId == null) {
                yAxis.push({title: {text: unit}});
                axisId = yAxis.length-1;
            }
            var ser = {
                name: k[0],
                data: k[1],
                yAxis: axisId,
                pointStart:hourly_starttime,
                pointInterval: pointInterval,
                type: (unit == 'mm' || unit == 'cm' || unit == 'inch' || unit == 'MJ/m²') ? 'column' : 'line',
                tooltip: {
                    valueSuffix: " " + unit,
                },
                dataGrouping: {groupPixelWidth: 12}
                /*dataGrouping: {
                    enabled: true,
                    forced: true,
                    units: [['year',[1]]]
                }*/
            };
    
            if (k[0] == "weathercode") {
                ser.tooltip.pointFormatter = function () {
                    let condition = codes[this.y];
                    return "<span style=\"color:"+this.series.color+"\">\u25CF</span> "+this.series.name+": <b>"+condition+"</b> ("+this.y+" wmo)<br/>"
                }
            }

            series.push(ser);
        });
    });

    var plotBands = []
    if ('daily' in data && 'sunrise' in data.daily && 'sunset' in data.daily) {
        let rise = data.daily.sunrise
        let set = data.daily.sunset
        var plotBands = rise.map(function(r, i) {
            return {
                "color": "rgb(255, 255, 194)",
                "from": (r + data.utc_offset_seconds) * 1000,
                "to": (set[i] + data.utc_offset_seconds) * 1000
            };
        });
    }

    let latitude = data.latitude.toFixed(2);
    let longitude = data.longitude.toFixed(2);
    let title = `${latitude}°N ${longitude}°E`;
    
    if ("elevation" in data) {
        let elevation = data.elevation.toFixed(0);
        title = `${title} ${elevation}m above sea level`;
    }
    let generationtime_ms = data.generationtime_ms.toFixed(2);

    let utc_offset_sign = data.utc_offset_seconds < 0 ? "" : "+"

    let json =  {

        //boost: {
            //useGPUTranslations: true,
            // Chart-level boost when there are more than 5 series in the chart
            //seriesThreshold: 1
        //},

        title: {
            text: title
        },
    
        subtitle: {
            text: `Generated in ${generationtime_ms}ms, downloaded in ${downloadTime.toFixed(0)}ms, time in GMT${utc_offset_sign}${data.utc_offset_seconds/3600}`
        },

        chart: {
            zoomType: 'x'
        },    
    
        yAxis: yAxis,
    
        xAxis: {
            type: 'datetime',
            plotLines: [{
                value: Date.now() + data.utc_offset_seconds * 1000,
                color: 'red',
                width: 2
            }],
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
                },
            }
        },
    
        series: series,
    
        responsive: {
            rules: [{
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
            }]
        },
        tooltip: {
            shared: series.length <= 5,
            animation: false
        }
    }
    //console.log(JSON.stringify(json, null, 2));
    if (document.getElementById('container')) {
        return Highcharts.chart('container', json);
    }
    if (document.getElementById('containerStockcharts')) {
        return Highcharts.stockChart('containerStockcharts', json);
    }
}

// Pass Dropdown class from bootstrap to trigger location search dropdown on result load
export function init(Dropdown) {
    // Show debug toggles
    if (location.hostname === "127.0.0.1" || location.hostname == "localhost" || location.hostname == "staging.open-meteo.com") {
        $(".debug-hidden").show();
    }

    /// Reference to current highcharts object
    let chart;

    $("#detect_gps").click(function(e){
        e.preventDefault();
        if(!'geolocation' in navigator) {
            alert("GPS not available");
            return;
         }
         navigator.geolocation.getCurrentPosition((position) => {
             $('#latitude').val(position.coords.latitude.toFixed(2));
             $('#longitude').val(position.coords.longitude.toFixed(2));
             $('#api_form').submit();
         }, (error) => {
             alert("An error occurred: " + error.message);
         });
    });
    
    
    $('#select_city_results').on("click", "a", function (e) {
        e.preventDefault();
        var row = $(e.currentTarget).data('item')
        $('#latitude').val(row.latitude.toFixed(2));
        $('#longitude').val(row.longitude.toFixed(2));
        $('#select_city').val(row.name);
        $('#select_city').blur();
        $('#api_form').submit();
        const dropdown = new Dropdown(document.querySelector('#select_city'))
        dropdown.hide()
    });

    /*$("#select_city").on('focus', () => {
        const dropdown = new bootstrap.Dropdown(document.querySelector('#select_city'))
        dropdown.show()
    })*/
    
    var render = (items) => {
        var resultsDiv = $('#select_city_results');
        resultsDiv.empty();
        if (items.length == 0) {
            resultsDiv.append($('<li><span class="dropdown-item">No locations found</span></li>'));
        }
        for (var i = 0, len = items.length; i < len; i++) {
            let row = items[i];
            var a = $(`<a class="dropdown-item" href="#">
                <img height=24 src="/images/country-flags/${row.country_code.toLowerCase()}.svg" title="${row.country}"/> 
                ${row.name} <small class="text-muted">${row.admin1||''} (${row.latitude.toFixed(2)}°E ${row.longitude.toFixed(2)}°N ${row.elevation}m asl)</small>
                </a>`
            );
            a.data('item', row);
            resultsDiv.append($('<li></li>').append(a));
        }
        const dropdown = new Dropdown(document.querySelector('#select_city'))
        dropdown.show()
    };
    
    var lastsearch = null;
    
    function onChangeSearch(e) {
        //console.log(e.target.value)
        var query = e.target.value;
        if (lastsearch == query) {
            return
        }
        lastsearch = query;
        var url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(query);
    
        $.ajax({
            type: "GET",
            url: url,
            dataType: 'json',
            success: function (data) {
                //console.log('Submission was successful.');
                //console.log(data);
                if (query == lastsearch) {
                    render(data.results||[]);
                }
            },
            error: function (data) {
                //console.log('An error occurred.');
                //console.log(data);
                alert("API error: "+data.responseJSON.reason);
            },
        });
    }
    $("#select_city").change(onChangeSearch);
    $("#select_city").keyup(onChangeSearch);
    
    
    var frm = $('#api_form');
    var frmInitialParameter = frm.serialize();

    /// Update URL immediately after form change
    frm.change(function(e){
        var previous = "";
        var first = true;
        var params = "";
    
        frm.serializeArray().forEach((v) => {
            let defaultValue = frm.find('[name="'+v.name+'"]').data("default");
            if (v.value == defaultValue || v.name == "use" || v.name == "self_hosted") {
                return;
            }
            if (previous == v.name) {
                params += "," + encodeURIComponent(v.value);
            } else {
                if (!first) {
                    params += "&"
                }
                params += v.name + "=" + encodeURIComponent(v.value);
            }
            previous = v.name;
            first = false;
        });
    
        // Set action URL to localhost for debugging
        var action = frm.prop('action');
        if ($('#localhost').is(":checked")) {
            const urlparts = new URL(action);
            action = `http://127.0.0.1:8080${urlparts.pathname}`;
        }
        if ($('#use').val() == "commercial") {
            const urlparts = new URL(action);
            action = `https://customer-${urlparts.hostname}${urlparts.pathname}`;
        }
        if ($('#use').val() == "self_hosted") {
            const urlparts = new URL(action);
            const server = $('#self_host_server').val()
            action = `${server}${urlparts.pathname}`;
        }
        let url = action + "?" + params;
        while (chart?.series.length) {
            chart?.series[0].remove();
        }
        chart?.showLoading("Settings changed. Please click 'Preview chart'");
    
        $('#api_url').val(url);
        $('#api_url_link').prop("href", url);
    });

    frm.submit(function(e){
        e.preventDefault();
    
        var t0 = performance.now()
        var previous = "";
        var first = true;
        var params = "";
        var params_no_key = "";
    
        frm.serializeArray().forEach((v) => {
            let defaultValue = frm.find('[name="'+v.name+'"]').data("default");
            if (v.value == defaultValue || v.name == "use" || v.name == "self_host_server") {
                return;
            }
            if (previous == v.name) {
                params += "," + encodeURIComponent(v.value);
                params_no_key += "," + encodeURIComponent(v.value);
            } else {
                if (!first) {
                    params += "&"
                    if (v.name != "apikey") {
                        params_no_key += "&"
                    }
                }
                params += v.name + "=" + encodeURIComponent(v.value);
                if (v.name != "apikey") {
                    params_no_key += v.name + "=" + encodeURIComponent(v.value);
                }
            }
            previous = v.name;
            first = false;
        });
    
        // Set action URL to localhost for debugging
        var action = frm.prop('action');
        if ($('#localhost').is(":checked")) {
            const urlparts = new URL(action);
            action = `http://127.0.0.1:8080${urlparts.pathname}`;
        }
        if ($('#use').val() == "commercial") {
            const urlparts = new URL(action);
            action = `https://customer-${urlparts.hostname}${urlparts.pathname}`;
        }
        if ($('#use').val() == "self_hosted") {
            const urlparts = new URL(action);
            const server = $('#self_host_server').val()
            action = `${server}${urlparts.pathname}`;
        }
        let url = action + "?" + params;
    
        if ("originalEvent" in e && e.originalEvent.submitter.name == "format") {
            window.location.href = `${url}&format=${e.originalEvent.submitter.value}`;
            return;
        }
    
        if (frmInitialParameter != frm.serialize()) {
            // Only set location hash for non default configurations
            window.location.hash = params_no_key;
        }
    
        $('#api_url').val(url);
        $('#api_url_link').prop("href", url);
        chart?.showLoading("Loading");
        
        $.ajax({
            type: frm.prop('method'),
            url: url + "&timeformat=unixtime",
            dataType: 'json',
            success: function (data) {
                var downloadTime = performance.now() - t0
                //console.log(data);
                chart = previewData(data, downloadTime);
            },
            error: function (data) {
                if (document.getElementById('container')) {
                    chart = Highcharts.chart('container', {title: {text:""}});
                }
                if (document.getElementById('containerStockcharts')) {
                    chart = Highcharts.chart('containerStockcharts', {title: {text:""}});
                }
                chart?.showLoading("API error: "+data.responseJSON.reason);
            },
        });
      });
    
      // restore form state from url
      let urlparams = window.location.hash.substring(1).split("&");
      if (urlparams.length > 2) {
        // uncheck all checkboxes
        frm.find("input[type=checkbox]").each(function() {
            this.checked = false;
        });
        for (const element of urlparams) {
            let parts = element.split("=");
            let key = parts[0];
            let value = decodeURIComponent(parts[1]);
            frm.find("select[name='" + key + "']").val(value);
            frm.find("input[name='" + key + "'][type=text]").val(value);
            frm.find("input[name='" + key + "'][type=number]").val(value);
            frm.find("input[name='" + key + "'][type=checkbox]").each(function() {
                this.checked = value.split(",").includes(this.value);
            });
        }
      }
    
      frm.submit();
      setupCheckboxCounter();
};
    