<script lang="ts">
	let { data } = $props();

	const location = data.location;
</script>

<h1>
	{location ? location.name : ''}, population: {location.population}
</h1>
