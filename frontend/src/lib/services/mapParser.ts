import type { Graph, ZoneNode, ZoneEdge, ZoneMetadata, EdgeMetadata } from '$lib/types/schema_types';

/**
 * Parses bracketed attributes like [color=green max_drones=12] into a key-value map
 */
function parseBrackets(bracketStr: string | undefined): Record<string, string> {
    const result: Record<string, string> = {};
    if (!bracketStr) return result;
    const content = bracketStr.replace(/[\[\]]/g, '').trim();
    if (!content) return result;
    const pairs = content.split(/\s+/);
    for (const pair of pairs) {
        const [key, val] = pair.split('=');
        if (key && val) {
            result[key.trim()] = val.trim();
        }
    }
    return result;
}

export function parseMapConfig(rawText: string, mapName: string): Graph {
    const lines = rawText.split(/\r?\n/);
    let nb_drones = 0;
    const nodes: ZoneNode[] = [];
    const edges: ZoneEdge[] = [];

    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_-]+)\s+(-?\d+)\s+(-?\d+)/;
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_-]+)-([a-zA-Z0-9_-]+)/;

    for (let line of lines) {
        line = line.trim();

        if (line.includes('#')) {
            line = line.split('#')[0].trim();
        }

        if (!line) continue;

        if (line.startsWith('nb_drones:')) {
            const parts = line.split(':');
            nb_drones = parseInt(parts[1]?.trim() || '0', 10);
            continue;
        }

        // 1. Evaluate Zones
        const zoneMatch = line.match(zoneRegex);
        if (zoneMatch) {
            const [fullMatch, type, id, xStr, yStr] = zoneMatch;

            const remainingPart = line.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: ZoneMetadata = {
                zone: (rawMeta.zone as unknown as ZoneMetadata['zone']) || 'normal',
                color: rawMeta.color || 'none',
                max_drones: rawMeta.max_drones ? parseInt(rawMeta.max_drones, 10) : 1
            };

            nodes.push({
                id: id,
                label: id,
                type: type as unknown as ZoneNode['type'],
                x: parseInt(xStr, 10),
                y: parseInt(yStr, 10),
                metadata
            });
            continue;
        }

        // 2. Evaluate Connections
        const connMatch = line.match(connectionRegex);
        if (connMatch) {
            const [fullMatch, from, to] = connMatch;

            const remainingPart = line.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: EdgeMetadata = {
                max_link_capacity: rawMeta.max_link_capacity ? parseInt(rawMeta.max_link_capacity, 10) : 1
            };

            edges.push({
                id: `${from}-${to}`,
                from: from,
                to: to,
                metadata
            });
            continue;
        }
    }
    return { name: mapName, nb_drones, nodes, edges };
}