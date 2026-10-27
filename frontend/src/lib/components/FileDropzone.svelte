<script lang="ts">
	import { validateConfigFile } from '$lib/utils/validFile';
	import { isValidationError } from '@sveltejs/kit';

	let {
		rawFileText = '',
		onFileLoaded = () => {}
	}: { onFileLoaded?: (text: string, filename: string) => void } = $props();
	let errorMessage = $state('');
	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		errorMessage = '';
		isDragging = false;
		if (event.dataTransfer?.files[0] != undefined) {
			if (!validateConfigFile(event.dataTransfer?.files[0]).valid) {
				errorMessage = isValidationError.error || 'Invalid file selected.';
				// alert(errorMessage);
				return;
			}
		}
		const afile = event.dataTransfer?.files[0];
		if (!afile) {
			// alert(
			// 	`This file shows as empty: ${event.dataTransfer?.getData('text/plain')}.\n\nYou might be trying to pass a reference, not an actual file.\n\nPlease try again from a different application (eg. Explorer). Exiting.`
			// );
			errorMessage = `This file shows as empty: ${event.dataTransfer?.getData('text/plain')}.\n\nYou might be trying to pass a reference, not an actual file.\n\nPlease try again from a different application (eg. Explorer). Exiting.`;
			return;
		}
		processFile(afile);
	}

	function handleDragLeave(event: DragEvent) {
		const dropzone = event.currentTarget as HTMLElement;
		if (event.relatedTarget instanceof Node && dropzone.contains(event.relatedTarget)) {
			return;
		}
		isDragging = false;
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'copy';
		}
		isDragging = true;
	}

	function handleFileSelect(event: Event) {
		errorMessage = '';
		const input = event.target as HTMLInputElement;
		if (input.files?.[0] != undefined) {
			if (!validateConfigFile(input.files?.[0]).valid) {
				errorMessage = isValidationError.error || 'Invalid file selected.';
				// alert(errorMessage);
				return;
			}
		}
		const file = input.files?.[0];
		if (!file) {
			// alert(
			// 	`This file shows as empty.\n\nYou might be trying to pass a reference, not an actual file.\n\nPlease try again from a different application (eg. Explorer). Exiting.`
			// );
			errorMessage = `This file shows as empty.\n\nYou might be trying to pass a reference, not an actual file.\n\nPlease try again from a different application (eg. Explorer). Exiting.`;
			return;
		}
		processFile(file);
	}

	async function processFile(file: File) {
		errorMessage = '';
		try {
			const text = await file.text();
			rawFileText = text;
			onFileLoaded(text, file.name);
		} catch {
			errorMessage = 'Failed to read file contents.\n\nThe file might be corrupted or unreadable.';
			// alert(errorMessage);
			return;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			fileInput?.click();
		}
	}
</script>

<div
	class="dropzone"
	class:dragging={isDragging}
	role="button"
	tabindex="0"
	aria-label="Drag and drop a map configuration text file here, or press Enter to browse files"
	ondragenter={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onclick={() => fileInput?.click()}
	onkeydown={handleKeyDown}
>
	{#if !errorMessage}
		<p>Drag and drop a map config file here, or click to select</p>
		<input
			bind:this={fileInput}
			type="file"
			accept=".txt"
			onchange={handleFileSelect}
			style="display: none;"
		/>
	{:else}
		<div class="dropzone-error">
			<p>{errorMessage}</p>
		</div>
	{/if}
</div>

<style>
	.dropzone {
		border: 2px dashed #ccc;
		padding: 20px;
		text-align: center;
		cursor: pointer;
	}
	.dropzone * {
		pointer-events: none;
	}
	.dragging {
		border-color: #000;
		background: #f9f9f9;
	}
	.dropzone-error {
		margin-top: 10px;
		padding: 8px 12px;
		background-color: #fdf2f2;
		border: 1px solid #f8b4b4;
		color: #9b1c1c;
		border-radius: 4px;
		font-size: 14px;
	}
</style>
