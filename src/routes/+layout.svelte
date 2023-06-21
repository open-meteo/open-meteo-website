<script lang="ts">
	import '../app.scss';
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { theme, themeIsDark} from '$lib/stores';
	import { MoonStarsFill, CircleHalf, SunFill, Github, Twitter } from "svelte-bootstrap-icons";
	import type { HtmlTag } from 'svelte/internal';

	onMount(async () => {
		const Dropdown = await import('bootstrap/js/dist/dropdown');
		const Collapse = await import('bootstrap/js/dist/collapse');

		const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
		const themeUnSubscriber = theme.subscribe((theme) => {
			switch (theme) {
			case 'auto': 
				$themeIsDark = prefersDarkMode.matches
				break;
			case 'dark':
				$themeIsDark = true
				break;
			case 'light':
				$themeIsDark = false
				break;
			}
		})
		
		// Update the store if OS preference changes
		const updateThemeOnChange: (this: MediaQueryList, ev: MediaQueryListEvent) => (any) = (e) => { if ($theme == 'auto') $themeIsDark = e.matches }
		prefersDarkMode.addEventListener('change', updateThemeOnChange)
		onDestroy(() => {
			prefersDarkMode.removeEventListener('change', updateThemeOnChange)
			themeUnSubscriber()
		})
	});

	let body: HTMLElement;
	const bindBody = (node: any) => (body = node);
	$: body?.setAttribute('data-bs-theme', $themeIsDark ? "dark": "")
</script>

<svelte:body use:bindBody />

<nav class="navbar navbar-expand-md navbar-light">
	<div class="container-fluid">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="28"
			height="28"
			fill="currentColor"
			class="bi bi-cloud-sun me-2"
			viewBox="0 0 16 16"
		>
			<path
				d="M7 8a3.5 3.5 0 0 1 3.5 3.555.5.5 0 0 0 .624.492A1.503 1.503 0 0 1 13 13.5a1.5 1.5 0 0 1-1.5 1.5H3a2 2 0 1 1 .1-3.998.5.5 0 0 0 .51-.375A3.502 3.502 0 0 1 7 8zm4.473 3a4.5 4.5 0 0 0-8.72-.99A3 3 0 0 0 3 16h8.5a2.5 2.5 0 0 0 0-5h-.027z"
			/>
			<path
				d="M10.5 1.5a.5.5 0 0 0-1 0v1a.5.5 0 0 0 1 0v-1zm3.743 1.964a.5.5 0 1 0-.707-.707l-.708.707a.5.5 0 0 0 .708.708l.707-.708zm-7.779-.707a.5.5 0 0 0-.707.707l.707.708a.5.5 0 1 0 .708-.708l-.708-.707zm1.734 3.374a2 2 0 1 1 3.296 2.198c.199.281.372.582.516.898a3 3 0 1 0-4.84-3.225c.352.011.696.055 1.028.129zm4.484 4.074c.6.215 1.125.59 1.522 1.072a.5.5 0 0 0 .039-.742l-.707-.707a.5.5 0 0 0-.854.377zM14.5 6.5a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"
			/>
		</svg>
		<a class="navbar-brand" href="/">Open-Meteo</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarCollapse"
			aria-controls="navbarCollapse"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarCollapse">
			<ul class="navbar-nav me-auto mb-2 mb-md-0">
				<li class="nav-item">
					<a href="/" class="nav-link" class:active={$page.url.pathname === '/'} aria-current="page"
						>Home</a
					>
				</li>
				<li class="nav-item">
					<a
						href="/en/features"
						class="nav-link"
						class:active={$page.url.pathname === '/en/features'}>Features</a
					>
				</li>
				<li class="nav-item">
					<a href="/en/pricing" class="nav-link" class:active={$page.url.pathname === '/en/pricing'}
						>Pricing</a
					>
				</li>
				<li class="nav-item">
					<a
						href="/en/docs"
						class="nav-link"
						class:active={$page.url.pathname.startsWith('/en/docs')}>API Docs</a
					>
				</li>
				<li class="nav-item">
					<a href="https://openmeteo.substack.com" class="nav-link" target="_blank">Blog</a>
				</li>
			</ul>
			<!--<div class="form-check form-switch ms-auto mt-3 me-3">
				<label class="form-check-label ms-3" for="lightSwitch">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="25"
						height="25"
						fill="currentColor"
						class="bi bi-brightness-high"
						viewBox="0 0 16 16"
					>
						<path
							d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"
						/>
					</svg>
				</label>
				<input class="form-check-input" type="checkbox" id="lightSwitch" bind:checked={$theme} />
			</div>
			{$theme}-->
			<ul class="navbar-nav ml-sm-auto">
				<li class="nav-item dropdown">
					<button class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center" id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static" aria-label="Toggle theme (dark)">
					  <MoonStarsFill class="bi my-1 theme-icon-active"/>
					  <span class="d-lg-none ms-2" id="bd-theme-text">Toggle theme</span>
					</button>
					<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
					  <li>
						<button type="button" class="dropdown-item d-flex align-items-center" class:active={$theme == 'light'} aria-pressed={$theme == 'light'} on:click={() => $theme = "light"}>
							<SunFill class="bi me-2 opacity-50 theme-icon" />
						  <!--<svg class="bi me-2 opacity-50 theme-icon"><use href="#sun-fill"></use></svg>-->
						  Light
						  <!--<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>-->
						</button>
					  </li>
					  <li>
						<button type="button" class="dropdown-item d-flex align-items-center" class:active={$theme == 'dark'} aria-pressed={$theme == 'dark'} on:click={() => $theme = "dark"}>
							<MoonStarsFill class="bi me-2 opacity-50 theme-icon"/>
						  Dark
						 <!-- <svg class="bi ms-auto d-none"><use href="#check2"></use></svg>-->
						</button>
					  </li>
					  <li>
						<button type="button" class="dropdown-item d-flex align-items-center" class:active={$theme == 'auto'} aria-pressed={$theme == 'auto'} on:click={() => $theme = "auto"}>
							<CircleHalf class="bi me-2 opacity-50 theme-icon" />
						  <!--<svg class="bi me-2 opacity-50 theme-icon"><use href="#circle-half"></use></svg>-->
						  Auto
						  <!--<svg class="bi ms-auto d-none"><use href="#check2"></use></svg>-->
						</button>
					  </li>
					</ul>
				</li>
				<li class="nav-item">
					<a
						class="nav-link p-2"
						href="https://github.com/open-meteo/open-meteo"
						target="_blank"
						rel="noopener"
						aria-label="GitHub"
					><Github width={28} height={28} class="navbar-nav-svg"/>
					</a>
				</li>
				<li class="nav-item">
					<a
						class="nav-link p-2"
						href="https://twitter.com/open_meteo"
						target="_blank"
						rel="noopener"
						aria-label="Twitter"
					><Twitter width={28} height={28} class="navbar-nav-svg"/>
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<slot />

<footer class="container py-5 pt-4 my-md-5 pt-md-5">
	<div class="row">
		<div class="col-6 col-md">
			<p class="h5">Open-Meteo</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/features">Features</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/pricing">Pricing</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/about">About us &amp; Contact</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/license">License</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/terms">Terms &amp; Privacy</a>
				</li>
			</ul>
		</div>
		<div class="col-6 col-md">
			<p class="h5">Weather APIs</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs">Weather Forecast API</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/historical-weather-api"
						>Historical Weather API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/ecmwf-api">ECMWF API</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/gfs-api"
						>GFS & HRRR Forecast API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/meteofrance-api"
						>MeteoFrance API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/dwd-api">DWD ICON API</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/gem-api">GEM API</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/jma-api">JMA API</a>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/metno-api">Met Norway API</a
					>
				</li>
			</ul>
		</div>
		<div class="col-6 col-md">
			<p class="h5">Other APIs</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/ensemble-api"
						>Ensemble API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/climate-api"
						>Climate Change API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/marine-weather-api"
						>Marine Weather API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/air-quality-api"
						>Air Quality API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/geocoding-api"
						>Geocoding API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/elevation-api"
						>Elevation API</a
					>
				</li>
				<li class="mb-1">
					<a class="link-secondary text-decoration-none" href="/en/docs/flood-api">Flood API</a>
				</li>
			</ul>
		</div>
		<div class="col-6 col-md">
			<p class="h5">External</p>
			<ul class="list-unstyled text-small">
				<li class="mb-1">
					<a
						class="link-secondary text-decoration-none"
						href="https://github.com/open-meteo/open-meteo"
						target="_blank">GitHub</a
					>
				</li>
				<li class="mb-1">
					<a
						class="link-secondary text-decoration-none"
						href="https://openmeteo.substack.com/"
						target="_blank">Blog</a
					>
				</li>
				<li class="mb-1">
					<a
						rel="me"
						class="link-secondary text-decoration-none"
						href="https://twitter.com/open_meteo"
						target="_blank">Twitter</a
					>
				</li>
				<li class="mb-1">
					<a
						rel="me"
						class="link-secondary text-decoration-none"
						href="https://fosstodon.org/@openmeteo"
						target="_blank">Mastodon</a
					>
				</li>
				<li class="mb-1">
					<a
						class="link-secondary text-decoration-none"
						href="https://status.open-meteo.com"
						target="_blank">Service status and uptime</a
					>
				</li>
			</ul>
		</div>
	</div>
	<div class="text-center pt-3">
		<small class="d-block text-muted">© 2022-2023 Copyright: Open-Meteo.com</small>
	</div>
</footer>
