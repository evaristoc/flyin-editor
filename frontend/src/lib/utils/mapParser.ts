import type { ParsedTopology, ZoneNode, ZoneEdge, ZoneMetadata, EdgeMetadata } from '$lib/types';

/**
 * Parses bracketed attributes like [color=green max_drones=12] into a key-value map
 */
function parseBrackets(bracketStr: string | undefined): Record<string, string> {
    const result: Record<string, string> = {};
    if (!bracketStr) return result;

    // Clean brackets out
    const content = bracketStr.replace(/[\[\]]/g, '').trim();
    if (!content) return result;

    // Split by whitespace pairs
    const pairs = content.split(/\s+/);
    for (const pair of pairs) {
        const [key, val] = pair.split('=');
        if (key && val) {
            result[key.trim()] = val.trim();
        }
    }
    return result;
}

export function parseMapConfig(rawText: string): ParsedTopology {
    const lines = rawText.split(/\r?\n/);
    let nb_drones = 0;
    const nodes: ZoneNode[] = [];
    const edges: ZoneEdge[] = [];
    // Match: type: id x y [optional metadata]
    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_]+)\s+(-?\d+)\s+(-?\d+)(?:\s+(\[.*\]))?$/;
    // Match: connection: from-to [optional metadata]
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_]+)-([a-zA-Z0-9_]+)(?:\s+(\[.*\]))?$/;
    for (let line of lines) {
        line = line.trim();
        // Ignore empty spacing and standard comments
        if (!line || line.startsWith('#')) continue;
        // Drones global property counter configuration
        if (line.startsWith('nb_drones:')) {
            const parts = line.split(':');
            nb_drones = parseInt(parts[1]?.trim() || '0', 10);
            continue;
        }
        // Zone declaration parsing matches
        const zoneMatch = line.match(zoneRegex);
        if (zoneMatch) {
            const [_, type, id, xStr, yStr, bracketStr] = zoneMatch;
            const rawMeta = parseBrackets(bracketStr);
            const metadata: ZoneMetadata = {
                zone: (rawMeta.zone as any) || 'normal',
                color: rawMeta.color || 'none',
                max_drones: rawMeta.max_drones ? parseInt(rawMeta.max_drones, 10) : 1
            };
            nodes.push({
                id,
                type: type as any,
                x: parseInt(xStr, 10),
                y: parseInt(yStr, 10),
                metadata
            });
            continue;
        }
        // Bidirectional connections tracing
        const connMatch = line.match(connectionRegex);
        if (connMatch) {
            const [_, from, to, bracketStr] = connMatch;
            const rawMeta = parseBrackets(bracketStr);
            const metadata: EdgeMetadata = {
                max_link_capacity: rawMeta.max_link_capacity ? parseInt(rawMeta.max_link_capacity, 10) : 1
            };
            edges.push({ from, to, metadata });
            continue;
        }
    }
    return { nb_drones, nodes, edges };
}