<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type { Graph, ZoneEdge, ZoneNode } from '$lib/types/schema_types';

	let { solutionData = null } = $props<{ solutionData: Graph | null }>();

	let containerDiv: HTMLDivElement;
	let KonvaModule: any = null;
	let stage: any = null;
	let interactionLayer: any = null;

	// Tooltip tracking state
	let tooltipVisible = $state<boolean>(false);
	let tooltipText = $state<string>('');
	let tooltipX = $state<number>(0);
	let tooltipY = $state<number>(0);

	// Active hover highlighting state
	let hoveredNodeId = $state<string | null>(null);

	async function initKonva() {
		if (!containerDiv) return;

		const { default: Konva } = await import('konva');
		KonvaModule = Konva;

		stage = new Konva.Stage({
			container: containerDiv,
			width: containerDiv.clientWidth || 800,
			height: 600
		});

		const bgLayer = new Konva.Layer();
		const gridLayer = new Konva.Layer();
		interactionLayer = new Konva.Layer();

		stage.add(bgLayer);
		stage.add(gridLayer);
		stage.add(interactionLayer);

		if (solutionData) {
			renderStaticTopology();
		}
	}

	function renderStaticTopology() {
		if (!stage || !solutionData || !KonvaModule) return;

		interactionLayer.destroyChildren();

		const width = stage.width();
		const height = stage.height();
		const PAD = 50;

		// const scaleX = (x: number) => PAD + x * (width - PAD * 2);
		// const scaleY = (y: number) => PAD + y * (height - PAD * 2);

		const connectedEdges = solutionData.edges;
		const connectedNodes = solutionData.nodes;
		if (connectedNodes.length === 0) return;

		// 1. Find the absolute bounding limits of the source data
		const xValues = connectedNodes.map((n) => n.x);
		const yValues = connectedNodes.map((n) => n.y);

		const minX = Math.min(...xValues);
		const maxX = Math.max(...xValues);
		const minY = Math.min(...yValues);
		const maxY = Math.max(...yValues);

		// Prevent division by zero if all nodes share the same coordinate axis
		const deltaX = maxX - minX || 1;
		const deltaY = maxY - minY || 1;

		// Define the dynamic normalization and scale transform pipelines
		const scaleX = (rawX: number) => {
			const normalized = (rawX - minX) / deltaX; // Maps raw value to [0.0, 1.0]
			return PAD + normalized * (width - PAD * 2); // Maps ratio to canvas viewport pixels
		};

		const scaleY = (rawY: number) => {
			const normalized = (rawY - minY) / deltaY; // Maps raw value to [0.0, 1.0]
			return PAD + normalized * (height - PAD * 2); // Maps ratio to canvas viewport pixels
		};

		// Find connected neighbors to help with highlighting logic later

		const nodeById = Object.fromEntries(connectedNodes.map((n) => [n.id, n]));
		// Draw Edges
		for (const edge of connectedEdges) {
			const fromNode = nodeById[edge.from];
			const toNode = nodeById[edge.to];

			if (fromNode && toNode) {
				const line = new KonvaModule.Line({
					points: [scaleX(fromNode.x), scaleY(fromNode.y), scaleX(toNode.x), scaleY(toNode.y)],
					stroke: '#cbd5e1',
					strokeWidth: 2,
					id: `edge-${edge.from}-${edge.to}`,
					listening: true,
					hitStrokeWidth: 10
				});

				// Mouse interactive triggers for detail presentation
				line.on('mouseenter', (e: any) => {
					hoveredNodeId = line.id;
					tooltipText = `Edge: ${line.id()}\n${connectedNodes.find((n) => n.id == edge.from).label} - ${connectedNodes.find((n) => n.id == edge.to).label}`;
					tooltipVisible = true;

					// Style feedback
					line.stroke('#7b61ff');
					line.strokeWidth(3);
					document.body.style.cursor = 'pointer';

					interactionLayer.batchDraw();
				});

				line.on('mousemove', () => {
					const mousePos = stage.getPointerPosition();
					if (mousePos) {
						tooltipX = mousePos.x + 15;
						tooltipY = mousePos.y + 15;
					}
				});

				line.on('mouseleave', () => {
					hoveredNodeId = null;
					tooltipVisible = false;

					// Reset style feedback
					line.stroke('#cbd5e1');
					line.strokeWidth(2);
					document.body.style.cursor = 'default';

					interactionLayer.batchDraw();
				});

				interactionLayer.add(line);
			}
		}

		// Draw Nodes
		for (const node of connectedNodes) {
			const cx = scaleX(node.x);
			const cy = scaleY(node.y);

			const circle = new KonvaModule.Circle({
				x: cx,
				y: cy,
				radius: 10,
				fill: node.metadata.color || '#64748b',
				stroke: '#1e293b',
				strokeWidth: 2,
				id: `node-${node.id}`
			});

			// Mouse interactive triggers for detail presentation
			circle.on('mouseenter', (e: any) => {
				hoveredNodeId = node.id;
				tooltipText = `Node: ${node.label || node.id}`;
				tooltipVisible = true;

				// Style feedback
				circle.stroke('#7b61ff');
				circle.strokeWidth(3);
				document.body.style.cursor = 'pointer';

				interactionLayer.batchDraw();
			});

			circle.on('mousemove', () => {
				const mousePos = stage.getPointerPosition();
				if (mousePos) {
					tooltipX = mousePos.x + 15;
					tooltipY = mousePos.y + 15;
				}
			});

			circle.on('mouseleave', () => {
				hoveredNodeId = null;
				tooltipVisible = false;

				// Reset style feedback
				circle.stroke('#1e293b');
				circle.strokeWidth(2);
				document.body.style.cursor = 'default';

				interactionLayer.batchDraw();
			});

			interactionLayer.add(circle);
		}

		interactionLayer.batchDraw();
	}

	// Reactive redraw binding when dataset changes
	$effect(() => {
		if (solutionData && stage) {
			renderStaticTopology();
		}
	});

	onMount(() => {
		initKonva();
	});

	onDestroy(() => {
		if (stage) {
			stage.destroy();
		}
	});
</script>

<div class="canvas-container">
	<div bind:this={containerDiv} class="canvas-viewport"></div>

	{#if tooltipVisible}
		<div class="html-tooltip" style:left="{tooltipX}px" style:top="{tooltipY}px">
			{tooltipText}
		</div>
	{/if}
</div>

<style>
	.canvas-container {
		position: relative;
		width: 100%;
		height: 600px;
	}
	.canvas-viewport {
		width: 100%;
		height: 100%;
		background-color: #ffffff;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
	}
	.html-tooltip {
		position: absolute;
		pointer-events: none;
		background-color: #1e293b;
		color: #f8fafc;
		padding: 6px 10px;
		border-radius: 4px;
		font-size: 12px;
		font-family: monospace;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		z-index: 10;
		white-space: pre-line;
	}
</style>
