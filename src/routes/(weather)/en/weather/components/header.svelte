<script lang="ts">
	import { page } from '$app/stores';

	import { theme, themeIsDark } from '$lib/stores';
	import MoonStarsFill from 'svelte-bootstrap-icons/lib/MoonStarsFill.svelte';
	import CircleHalf from 'svelte-bootstrap-icons/lib/CircleHalf.svelte';
	import SunFill from 'svelte-bootstrap-icons/lib/SunFill.svelte';
	import Github from 'svelte-bootstrap-icons/lib/Github.svelte';
	import Twitter from 'svelte-bootstrap-icons/lib/Twitter.svelte';
</script>

<nav class="flex justify-between items-center px-4 h-[60px]">
	<div class="flex items-center">
		<a class="flex items-center" href="/" data-sveltekit-preload-data="off">
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
			<span class="text-lg"> Open-Meteo </span>
		</a>

		<ul class="gap-2 ml-4 hidden md:flex">
			<li class="">
				<div class="vr d-none d-lg-flex h-100 mx-lg-2" />
				<hr class="d-lg-none my-2" />
			</li>
			<li class="">
				<a
					href="/"
					class="nav-link"
					class:active={$page.url.pathname === '/'}
					aria-current="page"
					title="Weather API"
					data-sveltekit-preload-data="off">Home</a
				>
			</li>
			<li class="">
				<a
					href="/en/features"
					class="nav-link"
					title="API Features"
					class:active={$page.url.pathname === '/en/features'}
					data-sveltekit-preload-data="off">Features</a
				>
			</li>
			<li class="">
				<a
					href="/en/pricing"
					class="nav-link"
					class:active={$page.url.pathname === '/en/pricing'}
					title="Pricing"
					data-sveltekit-preload-data="off">Pricing</a
				>
			</li>
			<li class="">
				<a
					href="/en/docs"
					class="nav-link"
					title="Documentation"
					class:active={$page.url.pathname.startsWith('/en/docs')}
					data-sveltekit-preload-data="off">API Docs</a
				>
			</li>
		</ul>
	</div>

	<ul class="flex items-center gap-2">
		<li class="">
			<a
				class=""
				href="https://github.com/open-meteo/open-meteo"
				target="_blank"
				rel="noopener"
				aria-label="GitHub"
				><Github width={28} height={28} class="" />
				<span class="hidden" id="bd-theme-text">GitHub</span>
			</a>
		</li>
		<li class="">
			<a
				class=""
				href="https://twitter.com/open_meteo"
				target="_blank"
				rel="noopener"
				aria-label="Twitter"
				><Twitter width={28} height={28} class="" />
				<span class="hidden" id="bd-theme-text">Twitter</span>
			</a>
		</li>
		<!-- <li class="">
			<div class="" />
			<hr class="" />
		</li>
		<li class="nav-item dropdown">
			<button
				class=""
				id="bd-theme"
				type="button"
				aria-expanded="false"
				data-bs-toggle="dropdown"
				data-bs-display="static"
				aria-label="Toggle theme (dark)"
			>
				{#if $theme == 'light'}
					<SunFill width={28} height={28} class="navbar-nav-svg" />
				{/if}

				{#if $theme == 'dark'}
					<MoonStarsFill style="margin: 1px 0;" width={26} height={26} class="navbar-nav-svg" />
				{/if}

				{#if $theme == 'auto'}
					<CircleHalf style="margin: 1px 0;" width={26} height={26} class="navbar-nav-svg" />
				{/if}

				<span class="d-md-none ms-2" id="bd-theme-text">Toggle theme</span>
			</button>
			<ul class="flex" aria-labelledby="bd-theme-text">
				<li>
					<button
						type="button"
						class="dropdown-item d-flex align-items-center"
						class:active={$theme == 'light'}
						aria-pressed={$theme == 'light'}
						on:click={() => ($theme = 'light')}
					>
						<SunFill class="bi me-2 opacity-50 theme-icon" />
						Light
					</button>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item d-flex align-items-center"
						class:active={$theme == 'dark'}
						aria-pressed={$theme == 'dark'}
						on:click={() => ($theme = 'dark')}
					>
						<MoonStarsFill class="bi me-2 opacity-50 theme-icon" />
						Dark
					</button>
				</li>
				<li>
					<button
						type="button"
						class="dropdown-item d-flex align-items-center"
						class:active={$theme == 'auto'}
						aria-pressed={$theme == 'auto'}
						on:click={() => ($theme = 'auto')}
					>
						<CircleHalf class="bi me-2 opacity-50 theme-icon" />
						Auto
					</button>
				</li>
			</ul>
		</li> -->
	</ul>
</nav>
