<script lang="ts">
	import { fade } from 'svelte/transition';

	import { resetMode, setMode, mode } from 'mode-watcher';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import Eclipse from 'lucide-svelte/icons/eclipse';
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			{#if $mode === 'dark'}
				<Moon size={22} strokeWidth={1.5} />
			{:else}<Sun size={22} strokeWidth={1.5} />{/if}
			<span class="md:hidden">Toggle theme</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item class="cursor-pointer" onclick={() => setMode('light')}
			><div class="flex items-center">
				<Sun class="mr-2" strokeWidth={1.2} />Light
			</div></DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer" onclick={() => setMode('dark')}
			><Moon size={22} class="mr-2" strokeWidth={1.2} />Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer" onclick={() => resetMode()}
			><Eclipse size={22} class="mr-2" strokeWidth={1.2} />System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
