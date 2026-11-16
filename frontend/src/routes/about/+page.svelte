<script lang="ts">
</script>

<div class="about-container">
	<h1>About the Fly-In Editor</h1>
	<p>A unidirectional text-to-graph configuration manager built with Svelte 5.</p>

	<h2>Core Architecture</h2>
	<ul>
		<li>
			<strong>Single Source of Truth:</strong> The text editor manages line-addressable data records.
		</li>
		<li>
			<strong>Reactive Visual Layer:</strong> The graph canvas renders updates dynamically without disrupting
			user selections.
		</li>
		<li>
			<strong>Multi-File Isolation:</strong> Manage multiple isolated record contexts safely within a
			single session.
		</li>
	</ul>

	<p><a href="/">Back to Fly-In Editor</a></p>
</div>

<style>
	.about-container {
		max-width: 600px;
		margin: 40px auto;
		padding: 20px;
		font-family: sans-serif;
		line-height: 1.6;
	}
	ul {
		margin: 20px 0;
		padding-left: 20px;
	}
	li {
		margin-bottom: 8px;
	}
</style>
