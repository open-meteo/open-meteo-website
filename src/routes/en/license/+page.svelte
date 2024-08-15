<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		const Tab = await import('bootstrap/js/dist/tab');
	});
</script>

<svelte:head>
	<title>🧑‍⚖️ License | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/license" />
	<meta
		name="description"
		content="Open-Meteo utilizes open-data from various national weather services, providing accurate forecasts worldwide. The API data is offered under Attribution 4.0 International (CC BY 4.0) license. You are free to share and adapt the material, with appropriate credit. The source code is available on GitHub under the GNU Affero General Public License. Researchers are encouraged to cite Open-Meteo in their work, promoting transparency and collaboration in the scientific community. Join us in supporting open-source initiatives and fostering a culture of recognition."
	/>
</svelte:head>

<div
	class="px-4 py-5 text-center text-white"
	style="
            background-image: url('/images/features_background.webp');
            background-size: cover;
            background-position: center;
            height: 300px;
          "
>
	<svg
		style="filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));"
		xmlns="http://www.w3.org/2000/svg"
		width="96"
		height="96"
		fill="currentColor"
		class="bi bi-cloud-rain mb-4"
		viewBox="0 0 16 16"
	>
		<path
			d="M4.158 12.025a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 0 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-.5 1.5a.5.5 0 0 1-.948-.316l.5-1.5a.5.5 0 0 1 .632-.317zm3 0a.5.5 0 0 1 .316.633l-1 3a.5.5 0 1 1-.948-.316l1-3a.5.5 0 0 1 .632-.317zm.247-6.998a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 11H13a3 3 0 0 0 .405-5.973zM8.5 2a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1 0 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 2z"
		/>
	</svg>
	<h1 class="display-5" style="text-shadow: 3px 3px 2px rgba(0, 0, 0, .7);">License</h1>
	<div class="col-lg-6 mx-auto" />
</div>

<div class="container col-xxl-8 px-4 py-5">
	<div class="row flex-lg-row align-items-top g-5 py-5">
		<div class="col-lg-6">
			<h2 class="display-5 lh-1 mb-3">Data Sources</h2>
			<p>Open-Meteo utilizes open-data from various national weather service including:</p>
			<ul>
				<li>
					Atmospheric, ensemble and wave forecasts from <a
						href="https://www.dwd.de"
						title="Deutscher Wetterdienst">Deutscher Wetterdienst DWD</a
					>
					(<a href="https://www.dwd.de/EN/service/copyright/copyright_node.html" title="DWD License"
						>License</a
					>)
				</li>
				<li>
					Atmospheric and ensemble forecasts from European Centre for <a
						href="https://www.ecmwf.int"
						title="ECMWF">Medium-Range Weather Forecasts ECMWF</a
					>
					(<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" title="ECMWF License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Atmospheric and ensemble forecasts from <a href="https://www.weather.gov/ncep/"
						>NOAA NCEP</a
					>
					(<a href="https://www.weather.gov/disclaimer" title="NOAA License">License</a>)
				</li>
				<li>
					Atmospheric and ensemble forecasts from <a
						href="https://weather.gc.ca/model_forecast/model_e.html"
						title="Canadian Weather Centre Modelling">Canadian Meteorological Centre CMC</a
					>
					(<a href="https://eccc-msc.github.io/open-data/licence/readme_en/" title="CMC License"
						>License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a href="https://meteofrance.fr" title="Météo-France"
						>Météo-France</a
					>
					(<a
						href="https://donneespubliques.meteofrance.fr/?fond=dossier&id_dossier=1"
						title="Meteofrance License">License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="https://www.jma.go.jp/"
						title="Japan Meteorological Agency JMA">Japan Meteorological Agency JMA</a
					>
					(<a href="https://www.jma.go.jp/jma/en/copyright.html" title="JMA License">License</a>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="https://www.met.no"
						title="Norwegian Meteorological Institute">Norwegian Meteorological Institute</a
					>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="MetNO License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="https://www.cma.gov.cn/en/"
						title="Chinese Meteorological Administration"
						>Chinese Meteorological Administration CMA</a
					>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="CMA License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="http://www.bom.gov.au/"
						title="Norwegian Meteorological Institute">Australian Bureau of Meteorology BOM</a
					>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="BOM License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="https://www.knmi.nl/"
						title="Royal Netherlands Meteorological Institute"
						>Royal Netherlands Meteorological Institute KNMI</a
					>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="KNMI License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Atmospheric forecasts from <a
						href="https://www.dmi.dk/"
						title="Danish Meteorological Institute">Danish Meteorological Institute DMI</a
					>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="DMI License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Weather reanalysis, air quality forecasts and elevation data from <a
						href="https://climate.copernicus.eu"
						title="Copernicus Climate Change Service C3S">Copernicus Climate Change Service C3S</a
					>
					(<a
						href="https://cds.climate.copernicus.eu/api/v2/terms/static/licence-to-use-copernicus-products.pdf"
						title="Copernicus License">License</a
					>)
				</li>
				<li>
					Flood forecasts from <a
						href="https://www.globalfloods.eu/"
						title="Global Flood Awareness System GloFAS">Global Flood Awareness System GloFAS</a
					>
					(<a
						href="https://cds.climate.copernicus.eu/api/v2/terms/static/cems-floods.pdf"
						title="GloFAS License">License</a
					>)
				</li>
				<li>
					Location database from <a href="https://www.geonames.org/" title="GeoNames">GeoNames</a>
					(<a href="https://creativecommons.org/licenses/by/4.0/" title="GeoNames License"
						>CC-BY License</a
					>)
				</li>
				<li>
					Icons from <a href="https://github.com/erikflowers/weather-icons" title="WeatherIcons"
						>Weather Icons</a
					>
					(<a href="https://openfontlicense.org/" title="Weather Icons License">SIL OFL 1.1</a>)
				</li>
			</ul>
		</div>
		<div class="col-lg-6">
			<h2 class="display-5 lh-1 mb-3">License</h2>
			<p class="lead">
				API data are offered under <a
					href="https://creativecommons.org/licenses/by/4.0/"
					target="_blank">Attribution 4.0 International (CC BY 4.0)</a
				>
			</p>
			<p>
				You are free to <strong>share:</strong> copy and redistribute the material in any medium or
				format and
				<strong>adapt:</strong> remix, transform, and build upon the material.
			</p>
			<p>
				<strong>Attribution:</strong> You must give appropriate credit, provide a link to the license,
				and indicate if changes were made. You may do so in any reasonable manner, but not in any way
				that suggests the licensor endorses you or your use.
			</p>
			<p>You must include a link next to any location, Open-Meteo data are displayed like:</p>
			<p>
				<code
					>&lt;a href=&quot;https://open-meteo.com/&quot;&gt;Weather data by
					Open-Meteo.com&lt;/a&gt;</code
				>
			</p>
			<p class="lead">Open-Meteo is open-source</p>
			<p>
				Source code is available on <a
					href="https://github.com/open-meteo/open-meteo"
					target="_blank">GitHub</a
				>
				under the GNU Affero General Public License Version 3 AGPLv3 or any later version. You can
				<a href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE" target="_blank"
					>find the license here</a
				>.
			</p>
		</div>

		<div class="col-lg-12">
			<h2 class="display-5 lh-1 mb-3">Citation</h2>
			<p>
				We encourage researchers in the field of meteorology and related disciplines to cite
				Open-Meteo in their work. By acknowledging Open-Meteo as the source of weather data and
				forecasts used in their research, researchers contribute to the growing body of knowledge
				and advancements in the field. Citing Open-Meteo not only gives proper credit to the API but
				also promotes transparency, reproducibility, and collaboration within the scientific
				community. Together, let's foster a culture of recognition and support for open-source
				initiatives like Open-Meteo, ensuring that future researchers can benefit from the valuable
				resources it provides.
			</p>
			<div class="border rounded p-3">
				<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
					<li class="nav-item" role="presentation">
						<button
							class="nav-link active"
							id="pills-apa-tab"
							data-bs-toggle="pill"
							data-bs-target="#pills-apa"
							type="button"
							role="tab"
							aria-controls="pills-apa"
							aria-selected="true">APA</button
						>
					</li>
					<li class="nav-item" role="presentation">
						<button
							class="nav-link"
							id="pills-mla-tab"
							data-bs-toggle="pill"
							data-bs-target="#pills-mla"
							type="button"
							role="tab"
							aria-controls="pills-mla"
							aria-selected="true">MLA</button
						>
					</li>
					<li class="nav-item" role="presentation">
						<button
							class="nav-link"
							id="pills-harvard-tab"
							data-bs-toggle="pill"
							data-bs-target="#pills-harvard"
							type="button"
							role="tab"
							aria-controls="pills-harvard"
							aria-selected="true">Harvard</button
						>
					</li>
					<li class="nav-item" role="presentation">
						<button
							class="nav-link"
							id="pills-bibtex-tab"
							data-bs-toggle="pill"
							data-bs-target="#pills-bibtex"
							type="button"
							role="tab"
							aria-controls="pills-bibtex"
							aria-selected="false">BibTeX</button
						>
					</li>
				</ul>
				<div class="tab-content" id="pills-tabContent">
					<div
						class="tab-pane fade show active"
						id="pills-apa"
						role="tabpanel"
						aria-labelledby="pills-apa-tab"
						tabindex="0"
					>
						<p>
							Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. <a
								title="zenodo publication"
								href="https://doi.org/10.5281/ZENODO.7970649"
								>https://doi.org/10.5281/ZENODO.7970649</a
							>
						</p>
					</div>
					<div
						class="tab-pane fade show"
						id="pills-mla"
						role="tabpanel"
						aria-labelledby="pills-mla-tab"
						tabindex="0"
					>
						<p>
							Zippenfenig, Patrick. Open-Meteo.com Weather API., Zenodo, 2023,
							doi:10.5281/ZENODO.7970649.
						</p>
					</div>
					<div
						class="tab-pane fade show"
						id="pills-harvard"
						role="tabpanel"
						aria-labelledby="pills-harvard-tab"
						tabindex="0"
					>
						<p>
							Zippenfenig, P. (2023) Open-Meteo.com Weather API. Zenodo. doi:
							10.5281/ZENODO.7970649.
						</p>
					</div>
					<div
						class="tab-pane fade"
						id="pills-bibtex"
						role="tabpanel"
						aria-labelledby="pills-bibtex-tab"
						tabindex="0"
					>
						<pre>
<code
								>@software&#123;Zippenfenig_Open-Meteo,
  author = &#123;Zippenfenig, Patrick&#125;,
  doi = &#123;10.5281/zenodo.7970649&#125;,
  license = &#123;CC-BY-4.0&#125;,
  title = &#123;Open-Meteo.com Weather API&#125;,
  year = &#123;2023&#125;,
  copyright = &#123;Creative Commons Attribution 4.0 International&#125;,
  url = &#123;https://open-meteo.com/&#125;
&#125;</code
							></pre>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
