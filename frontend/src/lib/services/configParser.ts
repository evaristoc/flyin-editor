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

/**
 * Parses a single configuration line into a LineRecord.
 */
export function parseSingleLine(raw: string, existingUuid?: string): LineRecord {
    const lineUuid = existingUuid || crypto.randomUUID();
    const trimmed = raw.trim();
    const zoneRegex = /^(start_hub|end_hub|hub):\s*([a-zA-Z0-9_-]+)\s+(-?\d+)\s+(-?\d+)/;
    const connectionRegex = /^connection:\s*([a-zA-Z0-9_-]+)-([a-zA-Z0-9_-]+)/;

    if (!trimmed || trimmed.startsWith('#')) {
        return { uuid: lineUuid, raw, type: trimmed ? 'comment' : 'empty' };
    }

    if (trimmed.startsWith('nb_drones:')) {
        const val = parseInt(trimmed.split(':')[1]?.trim() || '0', 10);
        return { uuid: lineUuid, raw, type: 'nb_drones', entity: val };
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
            uuid: lineUuid,
            entityId: id,
            label: id,
            type: type as unknown as ZoneNode['type'],
            x: parseInt(xStr, 10),
            y: parseInt(yStr, 10),
            metadata
        };
        return { uuid: node.uuid, raw, type: 'zone', entity: node };
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
            uuid: lineUuid,
            entityId: `${from}-${to}`,
            from: from,
            to: to,
            metadata
        };
        return { uuid: edge.uuid, raw, type: 'connection', entity: edge };
    }

    return { uuid: lineUuid, raw, type: 'malformed', diagnostic: 'Syntax error' };
}

export function parseToLineRecords(rawText: string): LineRecord[] {
    const rawLines = rawText.split(/\r?\n/);
    return rawLines.map((raw) => parseSingleLine(raw));
}
