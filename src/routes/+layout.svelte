<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import '@fortawesome/fontawesome-free/css/all.min.css';
</script>

<main class="p-4 flex flex-col gap-4 items-center">
	{@render children()}
</main>