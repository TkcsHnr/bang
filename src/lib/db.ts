import Dexie, { type Table } from 'dexie';

export interface card_type {
    id?: number,
    descEnable: boolean,
	title: string,
	border: string,
	imageUrl: string,
	description: string,
	symbols: string[],
	rank: string,
	suit: string,
    lives: number,
    crop?: boolean
}

export const default_card: card_type = {
    id: undefined,
    descEnable: true,
    title: "BANG",
    border: "blue.png",
    imageUrl: "/placeholder.jpg",
    description: "Szétlövik a fejedet.",
    symbols: ["bang.png"],
    rank: "Q",
    suit: "heart",
    lives: 4,
    crop: true
}

export class CustomDexie extends Dexie {

    cards!: Table<card_type>;

    constructor() {
        super('cards.db');
        this.version(1).stores({
            cards: '++id, descEnable, title, border, imageUrl, description, *symbols, rank, suit, lives, crop',
        });
    }
}

export const db = new CustomDexie();

export async function addCard(card?: card_type): Promise<number> {
    if(!card) 
        card = structuredClone(default_card);
    console.log(card.id);
    return await db.cards.add(card);
}

export async function updateCard(id: number, updates: Partial<card_type>): Promise<void> {
    await db.cards.update(id, updates);
}

export async function deleteCard(id: number): Promise<void> {
    await db.cards.delete(id);
}