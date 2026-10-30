import type { ZoneEdge, ZoneNode, LineRecord } from "$lib/types/schema_types";

// const parsedResult = {
//     type: "hub",
//     data: {
//         entityId: "server-room",
//         x: 100,
//         y: 200,
//         metadata: "metadata"
//     }
// };


// Entity creation with immutable UUID anchor (bidirectional ready)
export function createRecord(raw: string, parsed: ParsedEntity): LineRecord {
    return {
        uuid: crypto.randomUUID(),
        raw: raw,
        type: parsed.type,
        entity: parsed.entity ? {
            ...parsed.entity,
            uuid: crypto.randomUUID() // or system-level association if needed
        } : undefined,
        diagnostic: parsed.diagnostic
    };
}
// Appending to the data store (text representation)
export function appendRecord(records: LineRecord[], newRecord: LineRecord): LineRecord[] {
    return [...records, newRecord];
}

// 3. Moving a record (reordering in the list, zero graph impact due to UUID decoupling)
export function moveRecord(records: LineRecord[], entityId: string, targetIndex: number): LineRecord[] {
    const index = records.findIndex(r => r.entity && typeof r.entity === 'object' && 'id' in r.entity && r.entity.id === entityId);
    if (index === -1) return records;

    const updated = [...records];
    const [movedItem] = updated.splice(index, 1);

    // Clamp target index safely
    const safeIndex = Math.max(0, Math.min(targetIndex, updated.length));
    updated.splice(safeIndex, 0, movedItem);

    return updated;
}

// 4. Updating an existing record by UUID
export function updateRecord(records: LineRecord[], entityId: string, partialData: Record<string, any>): LineRecord[] {
    return records.map(record => {
        if (!record.entity || typeof record.entity !== 'object' || !('id' in record.entity) || record.entity.id !== entityId) {
            return record;
        }

        const updatedEntity = {
            ...record.entity,
            ...partialData
        };

        return {
            ...record,
            entity: updatedEntity,
            raw: serializeEntity(record.type, updatedEntity)
        };
    });
}

function serializeEntity(type: string, entity: any): string {
    // Placeholder for text-formatting logic matching your file syntax
    if (type === 'zone') {
        return `zone ${entity.id} ${entity.label} ${entity.x} ${entity.y}`;
    }
    if (type === 'connection') {
        return `connection ${entity.id} ${entity.from} ${entity.to}`;
    }
    return '';
}