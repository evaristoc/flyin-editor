// export interface Agent {
//     id: number;
//     name: string;
//     color: string;
//     path: number[];

// }

// export interface Node {
//     id: number;
//     x: number;
//     y: number;
//     label: string;
//     color: string;
// }

// export interface Edge {
//     from: number;
//     to: number;
// }

export interface ZoneMetadata {
    zone: 'normal' | 'blocked' | 'restricted' | 'priority';
    color: string;
    max_drones: number;
}

export interface ZoneNode {
    id: string;
    label: string;
    type: 'start_hub' | 'end_hub' | 'hub';
    x: number;
    y: number;
    metadata: ZoneMetadata;
}

export interface EdgeMetadata {
    max_link_capacity: number;
}

export interface ZoneEdge {
    id: string;
    from: string; //uuid of node 1
    to: string; // uuid of node 2
    metadata: EdgeMetadata;
}

export interface Graph {
    name: string;
    nb_drones: number;
    nodes: ZoneNode[];
    edges: ZoneEdge[];
}

export interface UploadedFile {
    id: string;
    name: string;
    rawText: string;
    parsedData: any;
}

// export interface ParsedFileContext {
//     data: {
//         name: string;
//         nodes: unknown[];
//         edges: unknown[];
//         nb_drones: number;
//     } | null;
//     rawFileText: string;
//     isConfirmed: boolean;
//     setParsedData: (data: Graph) => void;
//     confirmData: () => void;
//     clearData: () => void;
// }

export interface LineRecord {
    index: number;        // 0-based position (the ID)
    raw: string;          // Verbatim text of the line
    type: 'zone' | 'connection' | 'nb_drones' | 'comment' | 'empty' | 'malformed';
    entity?: ZoneNode | ZoneEdge | number; // The structured object extracted by the parser
    diagnostic?: string;  // Error message if flagged by the Diagnostic Gate
}

// export interface ParseResult {
//     lines: LineRecord[];
//     graph: Graph;
// }

export interface ParsedFileContext {
    lines: LineRecord[];
    data: Graph | null;
    rawFileText: string;
    isConfirmed: boolean;
    updateLineText: (index: number, newRaw: string) => void;
    setRawText: (rawText: string) => void;
    confirmData: () => void;
    clearData: () => void;
}


// export interface ParsedTopology {
//     nb_drones: number;
//     nodes: ZoneNode[];
//     edges: ZoneEdge[];
// }

// export interface Graph {
//     name: string;
//     nodes: Node[];
//     edges: Edge[];
//     // agents: Agent[];
//     // schedule: Record<number, number>;
// }