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