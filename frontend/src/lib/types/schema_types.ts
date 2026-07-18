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