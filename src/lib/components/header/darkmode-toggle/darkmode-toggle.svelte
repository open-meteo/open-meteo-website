<script lang="ts">
	import { resetMode, setMode, mode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-border hover:bg-accent flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 md:w-10  md:p-0 [&_svg]:h-6 [&_svg]:w-6"
		aria-labelledby="darkmode_toggle_label"
	>
		<span id="darkmode_toggle_label" class="md:hidden">Toggle theme</span>
		{#if mode.current === 'dark'}
			<svg
				class="lucide lucide-moon"
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		{:else}
			<svg
				class="lucide lucide-sun"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content preventScroll={false} align="end" class="border-border p-0">
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('light')}>
			<svg
				class="lucide lucide-sun mr-2"
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>Light
		</DropdownMenu.Item>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('dark')}
			><svg
				class="lucide lucide-moon mr-2"
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => resetMode()}
			><svg
				class="lucide lucide-eclipse mr-2"
				xmlns="http://www.w3.org/2000/svg"
				width="22"
				height="22"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M12 2a7 7 0 1 0 10 10" />
			</svg>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
