<script lang="ts">
    import { onMount } from "svelte";
    import { getSolutions } from "$lib/api/solutions";

    // let solutions: string[] = [];
    let solutions = $state([]);
	let error = $state(null);

    // async function loadSolutions() {
    //     try {
    //         solutions = await getSolutions();
	// 		console.log(solutions);
    //     } catch (e) {
    //         error = String(e);
    //     }
    // }

    // loadSolutions();
	onMount(async () => {
        try{
			const data = await getSolutions();
			console.log("component:", data);
			solutions = data.files; // adjust property name
		} catch (e) {
			error = e.message
		}


    });
</script>

<h1>Solutions</h1>

{#if error}
    <p>{error}</p>
{/if}

<ul>
	<pre>{JSON.stringify(solutions, null, 2)}</pre>
    <!-- {#each solutions.files as solution}
        <li>{solution}</li>
    {/each} -->
</ul>

