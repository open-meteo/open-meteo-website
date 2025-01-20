<script lang="ts">
	import { fade } from 'svelte/transition';

	import { updated } from '$app/state';

	import Cross from 'lucide-svelte/icons/x';

	import Button from '../ui/button/button.svelte';

	let updateNotificationClicked = $state(false);
</script>

{#if updated.current && !updateNotificationClicked}
	<div transition:fade role="region" aria-label="Notifications (F8)" tabindex="-1" style="">
		<span
			aria-hidden="true"
			style="position: fixed; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;"
		></span>
		<ol
			tabindex="-1"
			class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[460px]"
		>
			<li
				role="status"
				aria-live="off"
				aria-atomic="true"
				class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full bg-background text-foreground group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none"
				style="user-select: none; touch-action: none;"
			>
				<div class="grid gap-1">
					<div class="[&amp;+div]:text-xs text-sm font-semibold">
						<bold>Open-Meteo</bold> website has been updated
					</div>
					<div class="text-sm opacity-90">A newer version of the website is available</div>
				</div>
				<Button
					variant="custom"
					class="hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50"
					onclick={() => location.reload()}>Reload page</Button
				><Button
					variant="custom"
					class="text-foreground/50 hover:text-foreground absolute -top-1 right-0 rounded-md p-1 opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
					onclick={() => (updateNotificationClicked = true)}><Cross size="18" /></Button
				>
			</li>
		</ol>
		<span
			aria-hidden="true"
			style="position: fixed; border: 0px; width: 1px; height: 1px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; overflow-wrap: normal;"
		></span>
	</div>
{/if}
