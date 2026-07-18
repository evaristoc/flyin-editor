export function convertConfigToSolutionData(rawText: string) {
    const lines = rawText.split(/\r?\n/);
    let nb_drones = 0;
    const nodes = [];
    const edges = [];
    // Match syntax structures: type: id x y [optional metadata]
    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_]+)\s+(-?\d+)\s+(-?\d+)(?:\s+(\[.*\]))?$/;
    // Match syntax structures: connection: from-to [optional metadata]
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_]+)-([a-zA-Z0-9_]+)(?:\s+(\[.*\]))?$/;
    for (let line of lines) {
        line = line.trim();
        // Bypass empty rows and configuration comments
        if (!line || line.startsWith('#')) continue;
        // Capture global tracker parameters
        if (line.startsWith('nb_drones:')) {
            const parts = line.split(':');
            nb_drones = parseInt(parts[1]?.trim() || '0', 10);
            continue;
        }
        // Process nodes elements
        const zoneMatch = line.match(zoneRegex);
        if (zoneMatch) {
            const [_, type, id, xStr, yStr, bracketStr] = zoneMatch;
            // Inline metadata bracket parsing loop
            const metadata = { zone: 'normal', color: 'none', max_drones: 1 };
            if (bracketStr) {
                const pairs = bracketStr.replace(/[\[\]]/g, '').trim().split(/\s+/);
                for (const pair of pairs) {
                    const [k, v] = pair.split('=');
                    if (k && v) {
                        const cleanK = k.trim();
                        const cleanV = v.trim();
                        if (cleanK === 'zone') metadata.zone = cleanV;
                        if (cleanK === 'color') metadata.color = cleanV;
                        if (cleanK === 'max_drones') metadata.max_drones = parseInt(cleanV, 10);
                    }
                }
            }
            nodes.push({
                id,
                type,
                x: parseInt(xStr, 10),
                y: parseInt(yStr, 10),
                metadata
            });
            continue;
        }
        // Process edge linkages elements
        const connMatch = line.match(connectionRegex);
        if (connMatch) {
            const [_, from, to, bracketStr] = connMatch;
            const metadata = { max_link_capacity: 1 };
            if (bracketStr) {
                const pairs = bracketStr.replace(/[\[\]]/g, '').trim().split(/\s+/);
                for (const pair of pairs) {
                    const [k, v] = pair.split('=');
                    if (k && v && k.trim() === 'max_link_capacity') {
                        metadata.max_link_capacity = parseInt(v.trim(), 10);
                    }
                }
            }
            edges.push({ from, to, metadata });
            continue;
        }
    }
    return { nb_drones, nodes, edges };
}