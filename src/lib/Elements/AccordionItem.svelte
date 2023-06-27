<script lang="ts">
	import { slide } from 'svelte/transition';

	export let id: string;
	export let title: string;
	export let countTotal: number = 0;
	export let countActive: number = 0;

	export let open = countActive > 0;
	export let renderBody = open;

	function toggle() {
		open = !open;
		// Once body has been added, keep it
		// It may contain checkboxes that have been checked
		renderBody = renderBody || open;
	}
</script>

<div class="accordion-item">
	<h2 class="accordion-header" id="heading-{id}">
		<button
			class="accordion-button py-2"
			class:collapsed={!open}
			type="button"
			aria-expanded={open}
			aria-controls="collapse-{id}"
			on:click={toggle}
		>
			{title}
			{#if countActive > 0}
				<span class="badge rounded-pill bg-secondary ms-2"
					>{countActive}{#if countTotal > 0}&nbsp;/&nbsp;{countTotal}{/if}</span
				>
			{/if}
		</button>
	</h2>
	{#if renderBody}
		<div
			id="collapse-{id}"
			class="accordion-collapse"
			aria-labelledby="heading-{id}"
			class:collapse={!open}
			transition:slide
		>
			<div class="accordion-body row">
				<slot />
			</div>
		</div>
	{/if}
</div>
