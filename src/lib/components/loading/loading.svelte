<script lang="ts">
	import { fade } from 'svelte/transition';

	let { onclose }: { onclose?: () => void } = $props();

	const close = () => onclose?.();
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') close();
	}}
/>

<div
	in:fade={{ duration: 500 }}
	out:fade={{ duration: 500 }}
	role="status"
	aria-live="polite"
	class="fixed inset-x-0 top-0 bottom-0 bg-foreground/15 z-5 flex items-center justify-center"
>
	{#if onclose}
		<button
			type="button"
			onclick={close}
			aria-label="Cancel loading"
			class="hover:bg-foreground/10 text-foreground absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full duration-100 focus:outline-none"
		>
			<svg
				aria-hidden="true"
				class="lucide lucide-x"
				xmlns="http://www.w3.org/2000/svg"
				width="28"
				height="28"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	{/if}

	<svg
		aria-hidden="true"
		class="lucide lucide-loader-circle animate-spin"
		xmlns="http://www.w3.org/2000/svg"
		width="60"
		height="60"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M21 12a9 9 0 1 1-6.219-8.56" />
	</svg>
	<span class="sr-only">Loading...</span>
</div>
