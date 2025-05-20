<script lang="ts">
	let { data } = $props();

	const location = data.location;
</script>

<h1>
	{location ? location.asciiname  : 'hi'}, population: {location.population}
</h1>
