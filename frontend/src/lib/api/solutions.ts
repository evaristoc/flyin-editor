export function getSolutions(): string[] {
    const dataModules = import.meta.glob('../../../../data/solutions/*.txt');

    return Object.keys(dataModules).map((path) => {
        return path
            .replace('../../../../data/solutions/', '')
            .replace('.txt', '');
    });
}

export async function getSolution(name: string): Promise<string> {
    // Force Vite to evaluate these files raw as inline string assets during development
    const dataModules = import.meta.glob('../../../../data/solutions/*.txt', {
        query: '?raw',
        import: 'default',
        eager: true
    });

    const targetPath = `../../../../data/solutions/${name}.txt`;

    if (!(targetPath in dataModules)) {
        throw new Error(`Requested dataset key not found in manifest index: ${name}`);
    }

    // Return the raw text string directly to the parser routine
    return dataModules[targetPath] as unknown as string;
}