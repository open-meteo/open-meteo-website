<script lang="ts">
	let { data } = $props();

	const location = data.location;
	console.log(location);
</script>

<h1>
	{location ? location.name : 'hi'}, population: {location.population}
</h1>
