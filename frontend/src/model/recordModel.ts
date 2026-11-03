import { parseToLineRecords } from "$lib/services/configParser";
import { buildGraphFromRecords } from "$lib/services/buildGraph";
import type { LineRecord, Record } from "$lib/types/schema_types";

export function createRecord(initialId: string, initialName: string, rawText: string): Record {
    const fileid = initialId;
    let name = $state(initialName);
    let lines = $state<LineRecord[]>(parseToLineRecords(rawText));
    let isConfirmed = $state(true);
    let hoveredUuid = $state<string | null>(null);
    let selectedUuid = $state<string | null>(null);

    return {
        get data() { return buildGraphFromRecords(lines, 'current_map') },
        get fileid() { return fileid; },
        get name() { return name; },
        get lines() { return lines; },
        get isConfirmed() { return isConfirmed; },
        get hoveredUuid() { return hoveredUuid; },
        get selectedUuid() { return selectedUuid; },
        setName(newname: string) {
            name = newname;
        },
        setRawText(rawText: string) {
            lines = parseToLineRecords(rawText);
            isConfirmed = true;
        },
        updateLine(modifiedRecord: LineRecord) {
            const index = lines.findIndex((item) => item.uuid === modifiedRecord.uuid);
            if (index === -1) return;
            lines[index] = modifiedRecord;
        },
        addLine(newRecord: LineRecord) {
            lines = [...lines, newRecord];
        },
        moveLine(sourceUuid: string, targetUuid: string) {
            const sourceIndex = lines.findIndex((l) => l.uuid === sourceUuid);
            const targetIndex = lines.findIndex((l) => l.uuid === targetUuid);
            if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return;
            // Create a shallow copy of the array
            const updatedLines = [...lines];
            // Remove the source item
            const [movedItem] = updatedLines.splice(sourceIndex, 1);
            // Find the new target index after removal
            const newTargetIndex = updatedLines.findIndex((l) => l.uuid === targetUuid);
            // Insert the moved item at the target position
            updatedLines.splice(newTargetIndex, 0, movedItem);
            // Assign back to lines to trigger reactivity
            lines = updatedLines;
        },
        setHovered(uuid: string | null) {
            hoveredUuid = uuid;
        },
        setSelected(uuid: string | null) {
            selectedUuid = uuid;
        },
        confirmData() {
            isConfirmed = true;
        },
        clearData() {
            lines = [];
            isConfirmed = false;
        }
    };
}