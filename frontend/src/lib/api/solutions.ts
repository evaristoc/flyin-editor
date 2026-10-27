/**
 * NOTE FOR FUTURE ARCHITECTURE:
 * This implementation uses Vite's build-time bundling (import.meta.glob) 
 * strictly as a local development convenience. In production, solutions will 
 * be fetched dynamically from a runtime data source (such as a server-side 
 * folder, small database, or in-memory cache). This function serves as a temporary 
 * abstraction layer that will be refactored once the final storage backend is established.
 */
// export async function getSolutions(): Promise<string[]> {
//     const dataModules = await fetch('data/solutions');
//     if (!dataModules.ok) {
//         throw new Error('Failed to fetch solution list.')
//     }
//     return dataModules.json()

// }

// export async function getSolution(name: string): Promise<string> {
//     const dataModule = await fetch(`data/solutions?file=${encodeURIComponent(name)}`);
//     if (!dataModule.ok) {
//         throw new Error(`Failed to fetch solution: ${name}`);
//     }
//     return dataModule.text();
// }

export function getSolutions(): string[] {
    const dataModules = import.meta.glob('../../../../data/solutions/*.txt',
        {
            as: 'raw',
            eager: true
        }
    );
    return Object.keys(dataModules).map((path) => {
        return path
            .replace('../../../../data/solutions/', '')
            .replace('.txt', '');
    });
}
export async function getSolution(name: string): Promise<string> {
    if (!import.meta.env.DEV) {
        throw new Error("Local preset loading is disabled in production.");
    }
    // Force Vite to evaluate these files raw as inline string assets during development
    const dataModules = import.meta.glob('../../../../data/solutions/*.txt', {
        // query: '?raw',
        // import: 'default',
        as: 'raw',
        eager: true
    });

    const targetPath = `../../../../data/solutions/${name}.txt`;

    if (!(targetPath in dataModules)) {
        throw new Error(`Requested dataset key not found in manifest index: ${name}`);
    }

    // Return the raw text string directly to the parser routine
    return dataModules[targetPath] as unknown as string;
}