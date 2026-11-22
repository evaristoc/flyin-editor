<script lang="ts">
	import FileDropzone from '$lib/components/FileDropzone.svelte';
	import GraphRenderer from '$lib/components/GraphRenderer.svelte';
	import ConfigEditor from '$lib/components/ConfigEditor.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import OnboardingCarousel from '$lib/components/OnboardingCarousel.svelte';
	import { getContext, onMount } from 'svelte';
	import { createRecord } from '../model/recordModel.svelte.ts';
	import type { Record, WorkspaceRegistry } from '$lib/types/schema_types';

	const workSpace: WorkspaceRegistry = getContext('workSpace');
	// let dataStore = $derived(
	// 	workSpace.activeFile ? workSpace.contexts.get(workSpace.activeFile) : undefined
	// );
	let dataStore = $state<Record | null>(null);
	let hasFiles = $derived(workSpace.contexts.size > 0);
	let isHydrated = $state(false);
	let showOnboarding = $state(false);

	// Hydrate workspace and check onboarding flag on mount
	onMount(() => {
		// 1. Check onboarding
		const seenOnboarding = localStorage.getItem('has_seen_onboarding');
		if (!seenOnboarding) {
			showOnboarding = true;
		}

		// 2. Hydrate workspace state
		try {
			const savedState = localStorage.getItem('workspace_state_v1');
			if (savedState) {
				const parsed = JSON.parse(savedState);
				if (parsed && Array.isArray(parsed.contexts)) {
					for (const item of parsed.contexts) {
						const rawText = item.lines
							? item.lines.map((l: any) => l.raw || l.text || '').join('\n')
							: '';
						const record = createRecord(item.fileid, item.name, rawText);
						workSpace.addContext(record);
					}
					if (parsed.activeFileId && workSpace.contexts.has(parsed.activeFileId)) {
						workSpace.setActiveFile(parsed.activeFileId);
						dataStore = workSpace.contexts.get(parsed.activeFileId) || null;
					}
				}
			}
		} catch (error) {
			console.error('Failed to load persisted workspace state:', error);
			localStorage.removeItem('workspace_state_v1');
		}

		isHydrated = true;
	});

	// Save workspace state on changes (guarded by hydration)
	$effect(() => {
		if (!isHydrated) return;

		// Access reactive properties to track changes
		const size = workSpace.contexts.size;
		const active = workSpace.activeFile;

		const contextsArray = Array.from(workSpace.contexts.values()).map((record) => ({
			fileid: record.fileid,
			name: record.name,
			lines: record.lines
		}));

		const statePayload = {
			activeFileId: active,
			contexts: contextsArray
		};

		localStorage.setItem('workspace_state_v1', JSON.stringify(statePayload));
	});

	$effect(() => {
		if (!hasFiles) {
			workSpace.setActiveFile(null);
			dataStore = null;
		}
	});

	function handleFileLoaded(text: string, filename: string, fileid: string) {
		try {
			workSpace.addContext(createRecord(fileid, filename, text));
			if (fileid) workSpace.setActiveFile(fileid);
			dataStore = workSpace.contexts.get(fileid);
		} catch (error) {
			console.error('Failed to parse map configuration:', error);
		}
	}
	function handleCloseOnboarding() {
		localStorage.setItem('has_seen_onboarding', 'true');
		showOnboarding = false;
	}
</script>

{#if showOnboarding}
	<OnboardingCarousel onClose={handleCloseOnboarding} />
{/if}
<div class="app-layout">
	{#if hasFiles}
		<Sidebar />
	{/if}
	<main class="fileload-container">
		<header class="top-nav">
			<div>
				<b>Fly-In Editor</b> by
				<a class="nav-link" href="https://github.com/evaristoc/flyin-editor">evaristoc</a>
			</div>
			<nav class="nav-links">
				<a href="/about" class="nav-link">About</a>
				<button class="nav-link" onclick={() => (showOnboarding = true)}>Help</button>
			</nav>
		</header>
		<h1>Load Map Configuration</h1>
		{#if !workSpace.activeFile}
			<p>Drop your configuration text file below to begin.</p>
			<FileDropzone onFileLoaded={handleFileLoaded} />
		{:else}
			<h2>Graph Visualization</h2>
			<GraphRenderer />
			<ConfigEditor />
		{/if}
	</main>
</div>

<style>
	.app-layout {
		display: flex;
		height: 100vh;
	}
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}
	.nav-links {
		display: flex;
		gap: 25px;
		align-items: center;
		margin-left: auto;
	}
	.nav-link {
		background: none;
		border: none;
		color: #0066cc;
		cursor: pointer;
		font: inherit;
		padding: 0;
		text-decoration: none;
	}
	.nav-link:hover {
		text-decoration: underline;
	}
	.workspace-menu {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #ccc;
		padding-bottom: 0.5rem;
		margin-bottom: 1rem;
		font-size: 0.6rem;
	}
	.actions {
		display: flex;
		gap: 0.5rem;
	}
	.fileload-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		text-align: center;
		font-family: sans-serif;
	}
</style>
