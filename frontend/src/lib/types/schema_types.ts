export interface ZoneMetadata {
    zone: 'normal' | 'blocked' | 'restricted' | 'priority';
    color: string;
    max_drones: number;
}

export interface ZoneNode {
    id: string;
    type: 'start_hub' | 'end_hub' | 'hub';
    x: number;
    y: number;
    metadata: ZoneMetadata;
}

export interface EdgeMetadata {
    max_link_capacity: number;
}

export interface ZoneEdge {
    from: string;
    to: string;
    metadata: EdgeMetadata;
}

export interface ParsedTopology {
    nb_drones: number;
    nodes: ZoneNode[];
    edges: ZoneEdge[];
}