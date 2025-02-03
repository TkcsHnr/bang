import type { PageServerLoad } from './$types';
import fs from 'node:fs';
import path from 'path';
export const load = (async () => {
    const directoryPath = path.resolve('static/symbols');
    let symbols: string[] = [];
    try {
        symbols = fs.readdirSync(directoryPath);
    } catch(err) {}

    const directoryPath2 = path.resolve('static/borders');
    let borders: string[] = [];
    try {
        borders = fs.readdirSync(directoryPath2);
    } catch(err) {}
    return {symbols, borders};
}) satisfies PageServerLoad;    