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
	suit: string
}

export const default_card: card_type = {
    id: undefined,
    descEnable: true,
    title: "BANG",
    border: "border_blue.png",
    imageUrl: "/placeholder.jpg",
    description: "Szétlövik a fejedet.",
    symbols: ["bang.png"],
    rank: "Q",
    suit: "heart"
}

export class CustomDexie extends Dexie {

    cards!: Table<card_type>;

    constructor() {
        super('cards.db');
        this.version(1).stores({
            cards: '++id, descEnable, title, border, imageUrl, description, *symbols, rank, suit',
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
    try {
        await db.cards.update(id, updates);
        console.log(`Item with ID ${id} updated successfully.`);
    } catch (error) {
        console.error("Failed to update item:", error);
    }
}