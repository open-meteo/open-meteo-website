<script lang="ts">
	import { updated } from '$app/state';
	import { fade } from 'svelte/transition';

	let updateNotificationClicked = $state(false);
</script>

{#if updated.current && !updateNotificationClicked}
	<div
		transition:fade={{ duration: 250 }}
		class="position-fixed bg-light-subtle end-0 bottom-0 m-4 mb-8 rounded p-4 shadow-lg"
	>
		<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
			<div class="toast-header d-flex align-items-center justify-content-center">
				<strong class="me-1">Open-Meteo </strong>
				<span> website has updated</span>
				<button
					type="button"
					class="btn-close ms-2"
					aria-label="Close"
					onclick={() => (updateNotificationClicked = true)}
				></button>
			</div>
			<div class="toast-body mt-3">
				<button class="btn btn-outline-success px-3" onclick={() => location.reload()}>
					Reload the page
				</button>
			</div>
		</div>
	</div>
{/if}
