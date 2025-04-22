<script>
	import { mode } from 'mode-watcher';

	import { page } from '$app/state';

	import Logo from '$lib/assets/icons/rain.svelte';

	import Button from '$lib/components/ui/button/button.svelte';
</script>

<svelte:head>
	<title>500 Error | Open-Meteo.com</title>
	<link rel="canonical" href="https://open-meteo.com/en/about" />
</svelte:head>

<div class="h-[500px]">
	<div
		class="absolute -z-10 h-full w-full duration-300"
		style="
		  background-image: url('/images/features_background.webp');
          background-size: cover;
          background-position: center;
          height: 500px;
		  		  {mode.current === 'dark' ? 'opacity: 0.75;' : ''}"
	></div>
	<div class="container flex h-full flex-col items-center justify-center gap-6 text-white">
		<Logo width="96" height="96" shadow={true} />
		<h1 class="text-shadow text-3xl font-light shadow-[rgba(0,0,0,0.7)] md:text-5xl">
			Error {page.status}
		</h1>
		<div class="flex flex-col items-center justify-center gap-6 md:w-1/2">
			<p class="text-shadow text-center text-lg font-light shadow-[rgba(0,0,0,0.7)]">
				Sorry, there was an error: {page.error?.message}
			</p>
			<div class="mt-2 flex gap-4">
				<Button variant="default" href={'/'}>Home</Button>
				<Button variant="outline-white" href={'/en/docs'}>API Documentation</Button>
			</div>
		</div>
	</div>
</div>
