type Agent = {
	id: number;
	name: string;
	color: string;
	path: number[];

}

type Node = {
	id: number;
	x: number;
	y: number;
	label: string;
	color: string;
}

type Edge = {
	from: number;
	to: number;
}

type Graph = {
	name: string;
	nodes: Node[];
	edges: Edge[];
	agents: Agent[];
	schedule: Record<number, number>;
}