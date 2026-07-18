<script lang="ts">
  import { onMount } from 'svelte';
  import Plotly from 'plotly.js-dist-min';
  import type { Data, Layout, Config } from 'plotly.js';
  import type { Graph, Node, Edge, Agent } from '$lib/types';
  // 1. Declare props using the $props() rune
  let { solutionData = null } = $props<{ solutionData: Graph }>();

  let plotDiv: HTMLDivElement;

  const config: Partial<Config> = {
    responsive: true,
    displayModeBar: true
  };

  const baseLayout: Partial<Layout> = {
    title: 'Solution Output Visualization',
    margin: { t: 50, r: 30, l: 50, b: 50 },
    hovermode: 'closest'
  };

  // Use $effect to reactively trigger Plotly updates when solutionData changes
  $effect(() => {
    if (plotDiv && solutionData) {
      updatePlot(solutionData);
    }
  });

  function updatePlot(data: any) {
    const trace: Data = {
      x: data.x || [1, 2, 3],
      y: data.y || [4, 5, 6],
      type: 'scatter',
      mode: 'lines+markers',
      name: data.name || 'Dataset'
    };

    Plotly.react(plotDiv, [trace], baseLayout, config);
  }

  onMount(() => {
    if (plotDiv && solutionData) {
      updatePlot(solutionData);
    }
  });
</script>

<div bind:this={plotDiv} class="plotly-container"></div>

<style>
  .plotly-container {
    width: 100%;
    height: 600px;
  }
</style>