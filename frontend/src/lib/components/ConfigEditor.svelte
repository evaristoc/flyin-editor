<script lang="ts">
	import { getContext } from 'svelte';
	import type { ParsedFileContext } from '$lib/types/schema_types';

	const dataStore = getContext<ParsedFileContext>('parsedFileContext');
	let lines = $derived(dataStore?.configFileView ? dataStore.configFileView.split(/\r?\n/) : []);
</script>

{#if dataStore?.configFileView}
	<div class="viewer-container">
		<h3>Configuration Text View</h3>
		<pre class="config-display">
            <table class="config-table">
                <tbody>
                    {#each lines as line, index (index)}
						<tr data-line-number={index + 1}>
                            <td class="line-number">{index + 1}</td>
                            <td class="line-content"><code>{line}</code></td>
                        </tr>
					{/each}
                </tbody>
            </table>
        </pre>
	</div>
{/if}

<style>
	.viewer-container {
		margin-top: 20px;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 16px;
		background-color: #f9f9f9;
	}

	.config-display {
		max-height: 400px;
		overflow-y: auto;
		white-space: pre-wrap;
		word-break: break-all;
		font-family: monospace;
		margin: 0;
		padding: 12px;
		background-color: #fff;
		border: 1px solid #e0e0e0;
		text-align: left;
	}
	.config-line:hover {
		background-color: #f1f5f9; /* Ready for highlighting */
	}

	.line-number {
		user-select: none;
		color: #94a3b8;
		text-align: right;
		padding-right: 16px;
		min-width: 30px;
		border-right: 1px solid #e2e8f0;
		margin-right: 12px;
	}

	.config-table {
		width: 100%;
		border-collapse: collapse;
		font-family: monospace;
		font-size: 14px;
	}

	tr:hover {
		background-color: #f1f5f9;
	}

	.line-number {
		user-select: none;
		color: #94a3b8;
		text-align: right;
		padding: 2px 16px 2px 12px;
		width: 1%;
		white-space: nowrap;
		border-right: 1px solid #e2e8f0;
		vertical-align: top;
	}

	.line-content {
		padding: 2px 12px;
		white-space: pre-wrap;
		word-break: break-all;
		vertical-align: top;
	}
</style>
