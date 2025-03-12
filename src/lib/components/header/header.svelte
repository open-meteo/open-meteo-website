<script lang="ts">
	import { fade } from 'svelte/transition';

	import Logo from '$lib/assets/icons/sun.svg?raw&inline';

	import Menu from 'lucide-static/icons/menu.svg?raw&inline';
	import Cross from 'lucide-static/icons/x.svg?raw&inline';

	import X from 'simple-icons/icons/x.svg?raw&inline';
	import Github from 'simple-icons/icons/github.svg?raw&inline';

	import Button from '$lib/components/ui/button/button.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';

	import DarkmodeToggle from './darkmode-toggle/darkmode-toggle.svelte';

	let { pathname } = $props();

	let toggleMenu = $state(false);
</script>

<nav class="container flex flex-wrap py-4 md:flex-nowrap">
	<div class="flex w-full justify-between md:w-[unset]">
		<Button
			variant="ghost"
			class="-ml-3 flex gap-2 px-3 text-lg hover:bg-transparent [&_svg]:h-6 [&_svg]:w-6"
			href={'/'}
		>
			<div class="[&_svg]:h-7 [&_svg]:w-7">
				{@html Logo}
			</div>
			Open-meteo
		</Button>
		<Toggle
			name="mobile-menu"
			aria-label="Mobile menu"
			class="relative cursor-pointer px-6 md:hidden"
			bind:pressed={toggleMenu}
			variant="outline"
		>
			{#if !toggleMenu}
				<div class="absolute [&_svg]:h-5 [&_svg]:w-5" transition:fade={{ duration: 150 }}>
					{@html Menu}
				</div>
			{:else}
				<div class="absolute [&_svg]:h-5 [&_svg]:w-5" transition:fade={{ duration: 150 }}>
					{@html Cross}
				</div>
			{/if}
		</Toggle>
	</div>
	<div
		class="{toggleMenu
			? 'max-h-[300px] opacity-100 md:max-h-[unset]'
			: 'max-h-0 opacity-0 md:max-h-[unset] md:opacity-100'} -ml-3 w-full overflow-hidden duration-500"
	>
		<div class="flex flex-col pt-4 md:flex-row md:pt-0">
			<div class="flex flex-col md:flex-row">
				<hr class="border-border my-1 ml-3" />
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col gap-0 px-3 {pathname === '/' ? 'font-bold' : ''}"
					data-text="Home"
					href={'/'}
					onclick={() => (toggleMenu = false)}>Home</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col gap-0 px-3 {pathname === '/en/features'
						? 'font-bold'
						: ''}"
					data-text="Features"
					href={'/en/features'}
					onclick={() => (toggleMenu = false)}>Features</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col gap-0 px-3 {pathname === '/en/pricing'
						? 'font-bold'
						: ''}"
					data-text="Pricing"
					href={'/en/pricing'}
					onclick={() => (toggleMenu = false)}>Pricing</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col gap-0 px-3 {pathname.startsWith('/en/docs')
						? 'font-bold'
						: ''}"
					data-text="API Docs"
					href={'/en/docs'}
					onclick={() => (toggleMenu = false)}>API Docs</Button
				>
				<hr class="border-border mb-4 ml-3 mt-2" />
			</div>
			<div class="flex gap-1 md:ml-auto md:flex-row md:justify-self-end">
				<Button
					variant="ghost"
					href="https://github.com/open-meteo/open-meteo"
					aria-label="Github link"
					class="relative flex w-10 items-center gap-0"
					><div class="flex dark:fill-white [&_svg]:h-6 [&_svg]:w-6">
						{@html Github}
					</div></Button
				><Button
					variant="ghost"
					href="https://x.com/open_meteo"
					aria-label="X link"
					class="relative flex w-10 items-center gap-0"
					><div class="absolute dark:fill-white [&_svg]:h-5 [&_svg]:w-5">
						{@html X}
					</div></Button
				>
				<div class="border-border mx-2 hidden border-l md:flex"></div>
				<div class="ml-auto flex gap-1">
					<!-- <LocaleToggle {pathname} /> -->
					<div class="relative"><DarkmodeToggle /></div>
				</div>
			</div>
		</div>
	</div>
</nav>
