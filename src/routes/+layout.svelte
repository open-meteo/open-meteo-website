<script lang="ts">
	import Header from '$lib/components/header/header.svelte';
	import Footer from '$lib/components/footer/footer.svelte';
	import UpdateNotification from '$lib/components/notification/update.svelte';

	import '../app.scss';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Header />

{@render children?.()}

<Footer />

<UpdateNotification />
