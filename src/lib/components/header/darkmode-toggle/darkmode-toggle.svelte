<script lang="ts">
	import { resetMode, setMode } from 'mode-watcher';

	import * as m from '$lib/paraglide/messages.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">{m.toggle_theme()}</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item on:click={() => setMode('light')}>{m.light()}</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => setMode('dark')}>{m.dark()}</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => resetMode()}>{m.system()}</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
