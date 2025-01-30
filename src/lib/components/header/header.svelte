<script lang="ts">
	import { fade } from 'svelte/transition';

	import Logo from '$lib/assets/icons/sun.svelte';

	import Menu from 'lucide-svelte/icons/menu';
	import Cross from 'lucide-svelte/icons/x';

	import X from 'simple-icons/icons/x.svg?raw';
	import Github from 'simple-icons/icons/github.svg?raw';

	import Button from '$lib/components/ui/button/button.svelte';
	import Toggle from '$lib/components/ui/toggle/toggle.svelte';

	import DarkmodeToggle from './darkmode-toggle/darkmode-toggle.svelte';

	let { pathname } = $props();

	let toggleMenu = $state(false);
</script>

<nav class="container flex flex-wrap py-4 md:flex-nowrap">
	<div class="flex w-full justify-between md:w-[unset]">
		<Button variant="ghost" class="-ml-3 flex gap-2 px-3 text-lg" href={'/'}>
			<Logo width="28" height="28" />
			Open-meteo
		</Button>
		<Toggle
			name="mobile-menu"
			class="relative px-5 md:hidden"
			bind:pressed={toggleMenu}
			variant="outline"
		>
			{#if !toggleMenu}
				<div class="absolute" transition:fade={{ duration: 150 }}>
					<Menu />
				</div>
			{:else}
				<div class="absolute" transition:fade={{ duration: 150 }}>
					<Cross />
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
				<hr class="my-1 ml-3" />
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col px-3"
					data-text="Home"
					highlight={pathname === '/' ? 'active' : undefined}
					href={'/'}
					onclick={() => (toggleMenu = false)}>Home</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col px-3"
					data-text="Features"
					highlight={pathname === '/en/features' ? 'active' : undefined}
					href={'/en/features'}
					onclick={() => (toggleMenu = false)}>Features</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col px-3"
					data-text="Pricing"
					highlight={pathname === '/en/pricing' ? 'active' : undefined}
					href={'/en/pricing'}
					onclick={() => (toggleMenu = false)}>Pricing</Button
				>
				<Button
					variant="ghost"
					class="grow-text mr-auto flex-col px-3"
					data-text="API Docs"
					highlight={pathname.startsWith('/en/docs') ? 'active' : undefined}
					href={'/en/docs'}
					onclick={() => (toggleMenu = false)}>API Docs</Button
				>
				<hr class="mb-4 ml-3 mt-2" />
			</div>
			<div class="flex gap-1 md:ml-auto md:flex-row md:justify-self-end">
				<Button
					variant="ghost"
					href="https://github.com/open-meteo/open-meteo"
					class="relative w-10"
					><div class="flex h-7 w-7 dark:fill-white">
						{@html Github}
					</div></Button
				><Button variant="ghost" href="https://x.com/open_meteo" class="relative w-10"
					><div class="absolute h-5 w-5 dark:fill-white">
						{@html X}
					</div></Button
				>
				<div class="mx-2 hidden border-l md:flex"></div>
				<div class="ml-auto flex gap-1">
					<!-- {#if dev}
						<LocaleToggle {pathname} />
					{/if} -->
					<div class="relative"><DarkmodeToggle /></div>
				</div>
			</div>
		</div>
	</div>
</nav>
