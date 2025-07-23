import type { Parameters } from '$lib/docs';

export const weatherForecastObject = (params: Parameters) => {
	console.log(params);
	let today = new Date();

	const latitude =
		params.latitude.constructor === Array
			? params.latitude.length === 1
				? params.latitude
				: '<span style="color:#39ADB5">[</span>' +
					params.latitude.join(', ') +
					'<span style="color:#39ADB5">]</span>'
			: params.latitude;

	const longitude =
		params.longitude.constructor === Array
			? params.longitude.length === 1
				? params.longitude
				: '<span style="color:#39ADB5">[</span>' +
					params.longitude.join(', ') +
					'<span style="color:#39ADB5">]</span>'
			: params.longitude;

	let c = `
<pre class="css-variables" style="background-color:var(--code-preview-background);color:var(--code-preview-foreground)" tabindex="0"><code><span class="line"><span style="color:var(--code-preview-foreground)">{</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "latitude"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-constant)"> ${latitude}</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "longitude"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-constant)"> ${longitude}</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "elevation"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-constant)"> 44.812</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "generationtime_ms"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-constant)"> ${(Math.random() / 10).toFixed(4)}</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "utc_offset_seconds"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-constant)"> 0</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "timezone"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-string-expression)"> "${params.timezone}"</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "timezone_abbreviation"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-string-expression)"> "CEST"</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "hourly"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-foreground)"> {</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">        "time"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-string-expression)">"${today.getUTCFullYear()}-01-01T00:00"</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-string-expression)"> "${today.getUTCFullYear()}-01-01T01:00"</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-string-expression)"> "${today.getUTCFullYear()}-01-01T02:00"</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-foreground)"> ...]</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">        "temperature_2m"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-foreground)"> [</span><span style="color:var(--code-preview-token-constant)">13</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.7</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.7</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.5</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.5</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.8</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 13</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 12.9</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-token-constant)"> 13.3</span><span style="color:var(--code-preview-token-punctuation)">,</span><span style="color:var(--code-preview-foreground)"> ...]</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">    }</span><span style="color:var(--code-preview-token-punctuation)">,</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">    "hourly_units"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-foreground)"> {</span></span>
<span class="line"><span style="color:var(--code-preview-token-keyword)">        "temperature_2m"</span><span style="color:var(--code-preview-token-punctuation)">:</span><span style="color:var(--code-preview-token-string-expression)"> "°C"</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">    }</span></span>
<span class="line"><span style="color:var(--code-preview-foreground)">}</span></span>
</code></pre>`;
	return c;
};
