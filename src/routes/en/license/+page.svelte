<script lang="ts">
	import { fade } from 'svelte/transition';

	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';

	import Attribution from '$lib/components/code/license/attribution.svx';

	let citation = $state('apa');
</script>

<svelte:head>
	<title>🧑‍⚖️ License | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/license" />
	<meta
		name="description"
		content="Open-Meteo utilizes open-data from various national weather services, providing accurate forecasts worldwide. The API data is offered under Attribution 4.0 International (CC BY 4.0) license. You are free to share and adapt the material, with appropriate credit. The source code is available on GitHub under the GNU Affero General Public License. Researchers are encouraged to cite Open-Meteo in their work, promoting transparency and collaboration in the scientific community. Join us in supporting open-source initiatives and fostering a culture of recognition."
	/>
</svelte:head>

<div class="container my-6 grid grid-cols-1 gap-6 md:my-12 md:grid-cols-2 md:gap-12">
	<div>
		<h2 class="mb-3 text-3xl font-light lg:mb-5 lg:text-5xl">Data Sources</h2>
		<p>Open-Meteo utilizes open-data from various national weather service including:</p>
		<ul class="[&_a]:text-link ml-6 list-disc [&_a]:underline [&_li]:py-1">
			<li>
				Atmospheric, ensemble and wave forecasts from <a
					href="https://www.dwd.de"
					title="Deutscher Wetterdienst">Deutscher Wetterdienst DWD</a
				>
				(<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" title="ECMWF License"
					>CC-BY License</a
				>)
			</li>
			<li>
				Atmospheric, ensemble and wave forecasts from European Centre for <a
					href="https://www.ecmwf.int"
					title="ECMWF">Medium-Range Weather Forecasts ECMWF</a
				>
				(<a href="https://www.ecmwf.int/en/forecasts/datasets/open-data" title="ECMWF License"
					>CC-BY License</a
				>)
			</li>
			<li>
				Atmospheric, ensemble and wave forecasts from <a href="https://www.weather.gov/ncep/"
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
				Atmospheric and wave forecasts from <a href="https://meteofrance.fr" title="Météo-France"
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
					title="Chinese Meteorological Administration">Chinese Meteorological Administration CMA</a
				>
				(<a href="https://creativecommons.org/licenses/by/4.0/" title="CMA License">CC-BY License</a
				>)
			</li>
			<li>
				Atmospheric forecasts from <a
					href="http://www.bom.gov.au/"
					title="Norwegian Meteorological Institute">Australian Bureau of Meteorology BOM</a
				>
				(<a href="https://creativecommons.org/licenses/by/4.0/" title="BOM License">CC-BY License</a
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
				(<a href="https://creativecommons.org/licenses/by/4.0/" title="DMI License">CC-BY License</a
				>)
			</li>
			<li>
				Atmospheric forecasts from <a href="https://www.metoffice.gov.uk/" title="UK Met Office"
					>UK Met Office</a
				>
				(<a
					href="https://creativecommons.org/licenses/by-sa/4.0/deed.en"
					title="UK Met Office License">CC-BY-SA License</a
				>)
			</li>
			<li>
				Atmospheric forecasts from <a
					href="https://www.agenziaitaliameteo.it/en/homepage-en/"
					title="ItaliaMeteo-ARPAE">ItaliaMeteo-ARPAE</a
				>
				(<a href="https://creativecommons.org/licenses/by/4.0/" title="DMI License">CC-BY License</a
				>)
			</li>
			<li>
				Wave forecasts from <a
					href="https://www.metoffice.gov.uk/"
					title="Copernicus Marine Service">Copernicus Marine Service</a
				>
				(<a
					href="https://marine.copernicus.eu/user-corner/service-commitments-and-licence"
					title="Copernicus Marine Service License">License</a
				>)
			</li>
			<li>
				Weather reanalysis, air quality forecasts and elevation data from <a
					href="https://climate.copernicus.eu"
					title="Copernicus Climate Change Service C3S">Copernicus Climate Change Service C3S</a
				>
				(<a
					href="https://object-store.os-api.cci2.ecmwf.int/cci2-prod-catalogue/licences/licence-to-use-copernicus-products/licence-to-use-copernicus-products_b4b9451f54cffa16ecef5c912c9cebd6979925a956e3fa677976e0cf198c2c18.pdf"
					title="Copernicus License">License</a
				>)
			</li>
			<li>
				Flood forecasts from <a
					href="https://www.globalfloods.eu/"
					title="Global Flood Awareness System GloFAS">Global Flood Awareness System GloFAS</a
				>
				(<a
					href="https://object-store.os-api.cci2.ecmwf.int/cci2-prod-catalogue/licences/cems-floods/cems-floods_428a6e1019ec50b3dad9c37a90d630fab139059933a939dd5df620bfcb420cc3.pdf"
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
	<div>
		<h2 id="license" class="mb-3 text-3xl font-light lg:mb-5 lg:text-5xl">License</h2>
		<h3 class="mb-3 text-xl font-light">
			API data are offered under <a
				href="https://creativecommons.org/licenses/by/4.0/"
				target="_blank">Attribution 4.0 International (CC BY 4.0)</a
			>
		</h3>
		<p>
			You are free to <strong>share:</strong> copy and redistribute the material in any medium or
			format and
			<strong>adapt:</strong> remix, transform, and build upon the material.
		</p>
		<p>
			<strong>Attribution:</strong> You must give appropriate credit, provide a link to the license,
			and indicate if changes were made. You may do so in any reasonable manner, but not in any way that
			suggests the licensor endorses you or your use.
		</p>
		<p>You must include a link next to any location, Open-Meteo data are displayed like:</p>
		<p>
			<Attribution />
		</p>
		<h3 class="mb-3 mt-6 text-xl font-light">Open-Meteo is open-source</h3>
		<p>
			Source code is available on <a href="https://github.com/open-meteo/open-meteo" target="_blank"
				>GitHub</a
			>
			under the GNU Affero General Public License Version 3 AGPLv3 or any later version. You can
			<a href="https://github.com/open-meteo/open-meteo/blob/main/LICENSE" target="_blank"
				>find the license here</a
			>.
		</p>
	</div>
	<div class="md:col-span-2">
		<h2 id="citation" class="mb-3 text-3xl font-light lg:mb-5 lg:text-5xl">Citation</h2>
		<p>
			We encourage researchers in the field of meteorology and related disciplines to cite
			Open-Meteo in their work. By acknowledging Open-Meteo as the source of weather data and
			forecasts used in their research, researchers contribute to the growing body of knowledge and
			advancements in the field. Citing Open-Meteo not only gives proper credit to the API but also
			promotes transparency, reproducibility, and collaboration within the scientific community.
			Together, let's foster a culture of recognition and support for open-source initiatives like
			Open-Meteo, ensuring that future researchers can benefit from the valuable resources it
			provides.
		</p>

		<div class="border-border mt-3 rounded-lg border p-6">
			<ToggleGroup.Root type="single" bind:value={citation} class=" mb-3 justify-start gap-0">
				<div class="text-muted-foreground">Citation:</div>
				<div class="border-border ml-2 flex rounded-lg border">
					<ToggleGroup.Item
						value="apa"
						class="opacity-100! min-h-12 cursor-pointer rounded-e-none lg:min-h-[unset] "
						disabled={citation === 'apa'}
					>
						APA
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="mla"
						class=" opacity-100! min-h-12 cursor-pointer rounded-none duration-300 lg:min-h-[unset] "
						disabled={citation === 'mla'}
					>
						MLA
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="harvard"
						class=" opacity-100! min-h-12 cursor-pointer rounded-none duration-300 lg:min-h-[unset] "
						disabled={citation === 'harvard'}
					>
						Harvard
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="bibtex"
						class=" opacity-100! min-h-12 cursor-pointer rounded-md rounded-s-none duration-300 lg:min-h-[unset] "
						disabled={citation === 'bibtex'}
					>
						BibTex
					</ToggleGroup.Item>
				</div>
			</ToggleGroup.Root>

			<div>
				{#if citation === 'apa'}
					<div in:fade>
						<p>
							Zippenfenig, P. (2023). Open-Meteo.com Weather API [Computer software]. Zenodo. <a
								title="zenodo publication"
								href="https://doi.org/10.5281/ZENODO.7970649"
								>https://doi.org/10.5281/ZENODO.7970649</a
							>
						</p>
					</div>
				{:else if citation === 'mla'}
					<div in:fade>
						<p>
							Zippenfenig, Patrick. Open-Meteo.com Weather API., Zenodo, 2023,
							doi:10.5281/ZENODO.7970649.
						</p>
					</div>
				{:else if citation === 'harvard'}
					<div in:fade>
						<p>
							Zippenfenig, P. (2023) Open-Meteo.com Weather API. Zenodo. doi:
							10.5281/ZENODO.7970649.
						</p>
					</div>
				{:else if citation === 'bibtex'}
					<div in:fade>
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
				{/if}
			</div>
		</div>
	</div>
</div>
