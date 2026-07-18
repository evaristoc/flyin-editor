// import { apiFetch } from "./client";

// export async function getSolutions(){
// 	return apiFetch("/api/solutions");
// }

// export async function getSolution(name: string){
// 	const res = await apiFetch(`/api/solution/${name}`);
// 	if (res.status != 'ok'){
// 		throw new Error(`HTTP error connecting to solution/{name} endpoint: ${res.status}`);
// 	}
// 	console.log(res);
// 	return res;
// }

export function getSolutions(): string[] {
  const dataModules = import.meta.glob('../../../../data/solutions/*.json');
  
  return Object.keys(dataModules).map((path) => {
    return path
      .replace('../../../../data/solutions/', '')
      .replace('.json', '');
  });
}

export async function getSolution(name: string): Promise<Graph> {
  const dataModules = import.meta.glob('../../../../data/solutions/*.json');
  const targetPath = `../../../../data/solutions/${name}.json`;

  if (!(targetPath in dataModules)) {
    throw new Error(`Requested dataset key not found in manifest index: ${name}`);
  }

  const resolver = dataModules[targetPath] as () => Promise<{ default: Graph }>;
  const module = await resolver();
  
  return module.default;
}