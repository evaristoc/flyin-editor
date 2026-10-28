import type { LineRecord, ZoneEdge, ZoneNode, Graph } from "$lib/types/schema_types";


export function buildGraphFromRecords(records: LineRecord[], mapName: string): Graph {
    let nb_drones = 0;
    const nodes: ZoneNode[] = [];
    const edges: ZoneEdge[] = [];

    for (const record of records) {
        if (record.type === 'nb_drones' && typeof record.entity === 'number') {
            nb_drones = record.entity;
        } else if (record.type === 'zone' && record.entity) {
            nodes.push(record.entity as ZoneNode);
        } else if (record.type === 'connection' && record.entity) {
            edges.push(record.entity as ZoneEdge);
        }
    }

    return { name: mapName, nb_drones, nodes, edges };
}