import type { PageServerLoad } from './$types';
export const load = (async () => {
    const symbols = import.meta.glob('/static/symbols/*.{jpg,png,jpeg}', { eager: true });

    const borders = import.meta.glob('/static/borders/*.{jpg,png,jpeg}', { eager: true });

    const symbolNames = Object.keys(symbols).map(filePath => filePath.replace('/static/symbols/', ''));
    const borderNames = Object.keys(borders).map(filePath => filePath.replace('/static/borders/', ''));

    return { symbols: symbolNames, borders: borderNames };
}) satisfies PageServerLoad;    