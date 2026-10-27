<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { setContext } from 'svelte';
	import type { Graph, ParsedFileContext } from '$lib/types/schema_types';

	let parsedData = $state(null);
	let configFile = $state('');
	let isConfirmed = $state(false);

	const dataStore = {
		get data() {
			return parsedData;
		},
		get configFileView() {
			return configFile;
		},
		get isConfirmed() {
			return isConfirmed;
		},
		setParsedData(newData: Graph) {
			if (newData) {
				parsedData = newData;
				isConfirmed = false;
			}
		},
		setConfigFile(newConfig: string) {
			if (newConfig) {
				configFile = newConfig;
			}
		},
		confirmData() {
			isConfirmed = true;
		},
		clearData() {
			parsedData = null;
			isConfirmed = false;
		}
	};

	setContext<ParsedFileContext>('parsedFileContext', dataStore);
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
