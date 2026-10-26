<script lang="ts">
	let { onFileLoaded = () => {} }: { onFileLoaded?: (text: string, filename: string) => void } =
		$props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		console.log();
		const file = event.dataTransfer?.files[0];
		if (!file) {
			alert(
				`This file shows as empty: ${event.dataTransfer?.getData('text/plain')}.\n\nYou might be trying to pass a reference, not an actual file.\n\nPlease try again from a different application (eg. Explorer). Exiting.`
			);
			return;
		}
		processFile(file);
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
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			processFile(file);
		}
	}

	async function processFile(file: File) {
		const text = await file.text();
		onFileLoaded(text, file.name);
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
	<p>Drag and drop a map config file here, or click to select</p>
	<input
		bind:this={fileInput}
		type="file"
		accept=".txt"
		onchange={handleFileSelect}
		style="display: none;"
	/>
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
</style>
