<script lang="ts">
	import { i18n } from '$lib/i18n';

	import * as m from '$lib/paraglide/messages.js';
</script>

<footer class="container pb-16 pt-5">
	<div class="flex flex-wrap justify-between gap-5">
		<div class="col-6 col-md">
			<a href={i18n.route('/')} class="text-lg font-bold">Open-Meteo</a>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/features')}>{m.features()}</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/pricing')}>{m.pricing()}</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/about')}
						>{m.about_us()} &amp; {m.contact()}</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/license')}>{m.license()}</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/terms')}
						>{m.terms()} &amp; {m.privacy()}</a
					>
				</li>
			</ul>
		</div>
		<div class="">
			<a href={i18n.route('/docs')} class="text-lg font-bold">Weather APIs</a>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs')}
						>{m.weather_forecast_api()}</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/historical-weather-api')}
						>{m.historical_weather_api()}</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/ecmwf-api')}>ECMWF API</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/gfs-api')}
						>GFS & HRRR Forecast API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/meteofrance-api')}
						>Météo-France API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/dwd-api')}>DWD ICON API</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/gem-api')}>GEM API</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/jma-api')}>JMA API</a>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/metno-api')}
						>Met Norway API</a
					>
				</li>
			</ul>
		</div>
		<div class="">
			<p class="text-lg font-bold">Other APIs</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/ensemble-api')}
						>Ensemble API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/climate-api')}
						>Climate Change API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/marine-weather-api')}
						>Marine Weather API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/air-quality-api')}
						>Air Quality API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/geocoding-api')}
						>Geocoding API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/elevation-api')}
						>Elevation API</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/flood-api')}>Flood API</a>
				</li>
			</ul>
		</div>
		<div class="">
			<p class="text-lg font-bold">External</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a
						rel="me"
						class="text-secondary-foreground"
						href="https://x.com/open_meteo"
						target="_blank">X</a
					>
				</li>

				<li class="mb-1">
					<a
						class="text-secondary-foreground"
						href="https://openmeteo.substack.com/archive?sort=new">Blog</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href="https://github.com/open-meteo/open-meteo"
						>GitHub</a
					>
				</li>
				<li class="mb-1">
					<a
						rel="me"
						class="text-secondary-foreground"
						href="https://fosstodon.org/@openmeteo"
						target="_blank">Mastodon</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href="https://status.open-meteo.com" target="_blank"
						>Service status and uptime</a
					>
				</li>
				<li class="mb-1">
					<a class="text-secondary-foreground" href={i18n.route('/docs/model-updates')}
						>Model Updates Overview</a
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="pt-3 text-center">
		<small class="text-muted-foreground"
			>© 2022-{new Date().getFullYear()} Copyright:
			<a href={i18n.route('/')}>Open-Meteo.com</a></small
		>
	</div>
</footer>
