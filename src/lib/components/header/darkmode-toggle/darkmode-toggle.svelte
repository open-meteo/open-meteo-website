<script lang="ts">
	import { resetMode, setMode, mode } from 'mode-watcher';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Sun from 'lucide-static/icons/sun.svg?raw';
	import Moon from 'lucide-static/icons/moon.svg?raw';
	import Eclipse from 'lucide-static/icons/eclipse.svg?raw';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="border-border hover:bg-accent flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md px-3 md:w-10  md:p-0 [&_svg]:h-6 [&_svg]:w-6"
		aria-labelledby="darkmode_toggle_label"
	>
		<span id="darkmode_toggle_label" class="md:hidden">Toggle theme</span>
		{#if $mode === 'dark'}
			<div class="[&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-[1.5]">
				{@html Moon}
			</div>
		{:else}
			<div class="[&_svg]:h-6 [&_svg]:w-6 [&_svg]:stroke-[1.5]">
				{@html Sun}
			</div>
		{/if}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content preventScroll={false} align="end" class="border-border p-0">
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('light')}>
			<div class="mr-1 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.4]">
				{@html Sun}
			</div>
			Light
		</DropdownMenu.Item>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => setMode('dark')}
			><div class="mr-1 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.4]">
				{@html Moon}
			</div>
			Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer px-3 py-2" onclick={() => resetMode()}
			><div class="mr-1 [&_svg]:h-5 [&_svg]:w-5 [&_svg]:stroke-[1.4]">
				{@html Eclipse}
			</div>
			System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
