# About the Fly-In 42 Editor
An unidirectional text-to-graph configuration manager built with Svelte 5 for the School 42's Fly-In project.

## Core Architecture
* **Single Source of Truth**: The text editor manages line-addressable data records.
* **Reactive Visual Layer**: The graph canvas renders updates dynamically without disrupting user selections.
* **Multi-File Isolation**: Manage multiple isolated record contexts safely within a single session.
