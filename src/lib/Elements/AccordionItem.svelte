<script lang="ts">
	export let id: string;
	export let title: string;
	export let count = {active: 0, total: 0};

	export let open = count.active > 0;
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
			{#if count.active > 0}
				<span class="badge rounded-pill bg-secondary ms-2"
					>{count.active}{#if count.total > 0}&nbsp;/&nbsp;{count.total}{/if}</span
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
		>
			<div class="accordion-body row">
				<slot />
			</div>
		</div>
	{/if}
</div>
