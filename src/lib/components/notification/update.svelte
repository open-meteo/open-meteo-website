<script lang="ts">
	import { fade } from 'svelte/transition';

	import { updated } from '$app/state';

	let updateNotificationClicked = $state(false);
</script>

{#if updated.current && !updateNotificationClicked}
	<div
		transition:fade={{ duration: 250 }}
		class="position-fixed bottom-0 end-0 p-4 rounded m-4 mb-8 bg-light-subtle shadow-lg"
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
