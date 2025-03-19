<script lang="ts">
	import { resetMode, setMode, mode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Sun from 'lucide-static/icons/sun.svg?component';
	import Moon from 'lucide-static/icons/moon.svg?component';
	import Eclipse from 'lucide-static/icons/eclipse.svg?component';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-border hover:bg-accent flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 md:w-10  md:p-0 [&_svg]:h-6 [&_svg]:w-6"
		aria-labelledby="darkmode_toggle_label"
	>
		<span id="darkmode_toggle_label" class="md:hidden">Toggle theme</span>
		{#if $mode === 'dark'}
			<Moon width="22" height="22" stroke-width="1.5" viewBox="0 0 24 24" />
		{:else}
			<Sun width="22" height="22" stroke-width="1.5" viewBox="0 0 24 24" />
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content preventScroll={false} align="end" class="border-border p-0">
		<DropdownMenu.Item class="h-unset cursor-pointer px-3 py-2" onclick={() => setMode('light')}>
			<Sun width="22" height="22" class="mr-1" stroke-width="1.2" viewBox="0 0 24 24" />Light
		</DropdownMenu.Item>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('dark')}
			><Moon
				width="22"
				height="22"
				class="mr-1"
				stroke-width="1.2"
				viewBox="0 0 24 24"
			/>Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => resetMode()}
			><Eclipse
				width="22"
				height="22"
				class="mr-1"
				stroke-width="1.2"
				viewBox="0 0 24 24"
			/>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
