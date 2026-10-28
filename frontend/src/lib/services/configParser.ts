import type { LineRecord, ZoneNode, ZoneEdge, ZoneMetadata, EdgeMetadata } from "$lib/types/schema_types";


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

export function parseToLineRecords(rawText: string): LineRecord[] {
    const rawLines = rawText.split(/\r?\n/);
    const records: LineRecord[] = [];

    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_-]+)\s+(-?\d+)\s+(-?\d+)/;
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_-]+)-([a-zA-Z0-9_-]+)/;

    rawLines.forEach((raw, index) => {
        const trimmed = raw.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            records.push({ index, raw, type: trimmed ? 'comment' : 'empty' });
            return;
        }

        if (trimmed.startsWith('nb_drones:')) {
            const val = parseInt(trimmed.split(':')[1]?.trim() || '0', 10);
            records.push({ index, raw, type: 'nb_drones', entity: val });
            return;
        }

        const zoneMatch = trimmed.match(zoneRegex);
        if (zoneMatch) {
            const [fullMatch, type, id, xStr, yStr] = zoneMatch;

            const remainingPart = raw.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: ZoneMetadata = {
                zone: (rawMeta.zone as unknown as ZoneMetadata['zone']) || 'normal',
                color: rawMeta.color || 'none',
                max_drones: rawMeta.max_drones ? parseInt(rawMeta.max_drones, 10) : 1
            };
            const node: ZoneNode = {
                id: id,
                label: id,
                type: type as unknown as ZoneNode['type'],
                x: parseInt(xStr, 10),
                y: parseInt(yStr, 10),
                metadata
            }
            records.push({ index, raw, type: 'zone', entity: node });
            return;
        }

        const connMatch = trimmed.match(connectionRegex);
        if (connMatch) {
            const [fullMatch, from, to] = connMatch;

            const remainingPart = raw.substring(fullMatch.length).trim();
            const bracketMatch = remainingPart.match(/\[.*\]/);
            const rawMeta = parseBrackets(bracketMatch ? bracketMatch[0] : undefined);

            const metadata: EdgeMetadata = {
                max_link_capacity: rawMeta.max_link_capacity ? parseInt(rawMeta.max_link_capacity, 10) : 1
            };
            const edge: ZoneEdge = {
                id: `${from}-${to}`,
                from: from,
                to: to,
                metadata
            };
            records.push({ index, raw, type: 'connection', entity: edge });
            return;
        }

        // Fallback for malformed lines
        records.push({ index, raw, type: 'malformed', diagnostic: 'Syntax error' });
    });

    return records;
}