<script lang="ts">
	import { fade } from 'svelte/transition';

	import { updated } from '$app/state';

	import Button from '../ui/button/button.svelte';

	let updateNotificationClicked = $state(false);
</script>

{#if updated.current && !updateNotificationClicked}
	<div
		transition:fade
		class="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 pr-8 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[475px]"
	>
		<div
			class="border-border data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full bg-background text-foreground group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none"
			style="user-select: none; touch-action: none;"
		>
			<div class="grid gap-1">
				<div class="[&amp;+div]:text-xs text-sm font-semibold">
					<bold>Open-Meteo</bold> website has been updated
				</div>
				<div class="text-sm opacity-90">A newer version of the website is available</div>
			</div>
			<Button
				variant="outline"
				class="hover:bg-secondary focus:ring-ring group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive mr-2 inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50"
				onclick={() => location.reload()}>Reload page</Button
			><Button
				variant="ghost"
				class="text-foreground/50 hover:text-foreground absolute -top-1 right-0 rounded-md p-1 px-[0.4rem] opacity-0 transition-opacity focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
				onclick={() => (updateNotificationClicked = true)}
				><svg
					class="lucide lucide-x"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M18 6 6 18" />
					<path d="m6 6 12 12" />
				</svg></Button
			>
		</div>
	</div>
{/if}
