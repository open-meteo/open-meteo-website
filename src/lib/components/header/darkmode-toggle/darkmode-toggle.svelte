<script lang="ts">
	import { resetMode, setMode, mode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Eclipse from 'lucide-svelte/icons/eclipse';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-border hover:bg-accent flex h-10 w-10 cursor-pointer items-center justify-center rounded-md [&_svg]:h-6 [&_svg]:w-6"
		aria-labelledby="darkmode_toggle_label"
	>
		{#if $mode === 'dark'}
			<Moon size={22} strokeWidth={1.5} />
		{:else}<Sun size={22} strokeWidth={1.5} />{/if}
		<span id="darkmode_toggle_label" class="md:hidden">Toggle theme</span>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content preventScroll={false} align="end" class="border-border p-0">
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('light')}>
			<Sun class="mr-2" strokeWidth={1.2} />Light
		</DropdownMenu.Item>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('dark')}
			><Moon size={22} class="mr-2" strokeWidth={1.2} />Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => resetMode()}
			><Eclipse size={22} class="mr-2" strokeWidth={1.2} />System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
