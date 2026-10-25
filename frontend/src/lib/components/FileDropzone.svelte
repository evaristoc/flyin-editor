<script lang="ts">
	let { onFileLoaded = () => {} }: { onFileLoaded?: (text: string, filename: string) => void } =
		$props();

	let isDragging = $state(false);
	let fileInput: HTMLInputElement;

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		const file = event.dataTransfer?.files[0];
		if (file) {
			processFile(file);
		}
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
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={(e) => {
		e.preventDefault();
		isDragging = false;
	}}
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
	.dragging {
		border-color: #000;
		background: #f9f9f9;
	}
</style>
