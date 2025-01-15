<script lang="ts">
	import { goto } from '$app/navigation';

	import { i18n } from '$lib/i18n';

	import * as m from '$lib/paraglide/messages.js';
	import { languageTag } from '$lib/paraglide/runtime.js';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';

	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	let { pathname } = $props();

	const switchToLanguage = (newLanguage: AvailableLanguageTag) => {
		const canonicalPath = i18n.route(pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	};
</script>

<DropdownMenu.Root preventScroll={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			<span>{languageTag()}</span>
			<span class="sr-only">{m.toggle_language()}</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item on:click={() => switchToLanguage('en')}>English</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => switchToLanguage('de')}>Deutsch</DropdownMenu.Item>
		<!-- <DropdownMenu.Item on:click={() => switchToLanguage('fr')}>Français</DropdownMenu.Item> -->
	</DropdownMenu.Content>
</DropdownMenu.Root>
