<script lang="ts">
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import XIcon from '@lucide/svelte/icons/x';

	import { updated } from '$app/state';

	import { fade } from '$lib/utils/transitions';

	import { Button } from '$lib/components/ui/button';

	let updateNotificationClicked = $state(false);
</script>

{#if updated.current && !updateNotificationClicked}
	<div
		transition:fade
		role="status"
		aria-live="polite"
		class="fixed top-0 z-100 flex w-full justify-center p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:justify-end md:max-w-118.75"
	>
		<div
			class="border-border bg-background text-foreground pointer-events-auto relative flex w-full flex-col gap-3 rounded-md border p-4 pr-10 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:gap-4"
		>
			<div class="grid gap-1">
				<div class="text-sm font-semibold">Website updated</div>
				<div class="text-muted-foreground text-sm">
					A newer version of <strong>Open-Meteo</strong> is available.
				</div>
			</div>
			<Button
				variant="outline"
				class="h-8 shrink-0 gap-2 self-start px-3 text-sm sm:self-auto"
				onclick={() => location.reload()}
			>
				<RefreshCwIcon class="size-3.5" />
				Reload page
			</Button>
			<Button
				variant="ghost"
				class="text-foreground/50 hover:text-foreground absolute top-1 right-1 size-7 rounded-md p-0"
				aria-label="Dismiss notification"
				onclick={() => (updateNotificationClicked = true)}
			>
				<XIcon class="size-4" />
			</Button>
		</div>
	</div>
{/if}
