<script lang="ts">
	import SVGDroppingFile from './SVGDroppingFile.svelte';
	import SVGModifyFile from './SVGModifyFile.svelte';
	import SVGSelectingFile from './SVGSelectingFile.svelte';

	let { onClose }: { onClose: () => void } = $props();

	let currentStep = $state(0);
	const steps = [
		{
			title: 'Welcome to the Fly-in Editor',
			description:
				'Load your configuration files via drag and drop to instantly generate interactive visual graphs.'
		},
		{
			title: 'Line-Addressable Editing',
			description:
				'Edit lines directly in the text editor. Changes reflect instantly on the graph canvas while preserving stable element references.'
		},
		{
			title: 'Multi-File Workspace',
			description:
				'Manage multiple configuration files simultaneously through the sidebar, switch contexts easily, and export your work anytime.'
		}
	];

	function nextStep() {
		if (currentStep < steps.length - 1) {
			currentStep++;
		} else {
			onClose();
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}
</script>

<div class="modal-backdrop">
	<div class="carousel-modal">
		<div class="icon-container">
			{#if currentStep === 0}
				<SVGDroppingFile />
			{:else if currentStep === 1}
				<SVGModifyFile />
			{:else if currentStep === 2}
				<SVGSelectingFile />
			{/if}
		</div>
		<h2>{steps[currentStep].title}</h2>
		<p>{steps[currentStep].description}</p>

		<div class="carousel-footer">
			<span class="step-indicator">Step {currentStep + 1} of {steps.length}</span>
			<div class="actions">
				{#if currentStep > 0}
					<button onclick={prevStep}>Back</button>
				{/if}
				<button class="primary" onclick={nextStep}>
					{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.carousel-modal {
		background: white;
		padding: 30px;
		border-radius: 8px;
		max-width: 450px;
		width: 100%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		font-family: sans-serif;
	}
	.carousel-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 25px;
	}
	.step-indicator {
		font-size: 0.85rem;
		color: #666;
	}
	.actions {
		display: flex;
		gap: 10px;
	}
	button {
		padding: 8px 16px;
		cursor: pointer;
		border: 1px solid #ccc;
		background: #f8f8f8;
		border-radius: 4px;
	}
	button.primary {
		background: #0066cc;
		color: white;
		border-color: #0055b3;
	}
</style>
