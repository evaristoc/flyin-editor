MAPF Classroom Editor - current state

Goal:
Build a graph editor on top of PNG classroom layouts for MAPF evacuation scenarios.

Technology:
- FastAPI backend
- HTML/Javascript frontend
- Canvas rendering
- JSON only used for browser communication
- Main config format is custom text format

Current functionality:
✓ Load PNG background
✓ Place nodes with coordinates
✓ Node model:
    - name
    - category
    - attributes
        - color
        - max_drones
✓ Edit node properties
✓ Export node configuration
✓ Create edges in edge mode
✓ Prevent duplicate edges
✓ Render edges
✓ Show edge table/context view

Current decisions:
- Nodes have categories.
- Edges have attributes but no categories.
- Edge attributes:
    - max_link_capacity
- Do not implement deletion yet.
- Avoid UUID migration for now; project currently uses names.
- Consider UUID/internal IDs later.

Next planned step:
1. Edge attribute editing.
2. Close/open edge table behaviour.
3. Improve export for connections.

Future:
- Node deletion with edge cleanup.
- Edge deletion.
- Zones.
- Initial occupancy for evacuation scenarios.
- MAPF simulation integration.