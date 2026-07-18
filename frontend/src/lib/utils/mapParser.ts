import type { Graph, ZoneNode, ZoneEdge, ZoneMetadata, EdgeMetadata } from '$lib/types/schema_types';

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

function generateShortId(length = 8): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);

    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[arr[i] % chars.length];
    }
    return result;
}

export function parseMapConfig(rawText: string, mapName: string): Graph {
    const lines = rawText.split(/\r?\n/);
    let nb_drones = 0;
    const nodes: ZoneNode[] = [];
    const edges: ZoneEdge[] = [];

    // Removed the restrictive line-end ($) anchors to make matching resilient
    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_-]+)\s+(-?\d+)\s+(-?\d+)/;
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_-]+)-([a-zA-Z0-9_-]+)/;

    for (let line of lines) {
        line = line.trim();

        // Strip trailing inline comments if present, then trim again
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

            // Extract brackets cleanly relative to the match position
            const remainingPart = line.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: ZoneMetadata = {
                zone: (rawMeta.zone as any) || 'normal',
                color: rawMeta.color || 'none',
                max_drones: rawMeta.max_drones ? parseInt(rawMeta.max_drones, 10) : 1
            };

            nodes.push({
                id: generateShortId(),
                label: id,
                type: type as any,
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

            // Extract brackets cleanly relative to the match position
            const remainingPart = line.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: EdgeMetadata = {
                max_link_capacity: rawMeta.max_link_capacity ? parseInt(rawMeta.max_link_capacity, 10) : 1
            };
            edges.push({
                id: generateShortId(),
                from: nodes.find(n => n.label == from).id,
                to: nodes.find(n => n.label == to).id,
                metadata
            });
            continue;
        }
    }
    return { name: mapName, nb_drones, nodes, edges };
}