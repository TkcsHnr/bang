<script lang="ts">
	import { db, type card_type, addCard, updateCard } from '$lib/db';
	import Card from '$lib/Card.svelte';
	import type { PageData } from './$types';
	import { liveQuery } from 'dexie';
	import { browser } from '$app/environment';
	import { toPng } from 'html-to-image';
    import JSZip from 'jszip';


	export let data: PageData;

	$: cards = liveQuery(() => (browser ? db.cards.toArray() : []));

	const rank_list = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	const suit_list = ['heart', 'diamond', 'club', 'spade'];
	const pair_list: Partial<card_type>[] = [];
	rank_list.forEach((r) => {
		suit_list.forEach((s) => {
			pair_list.push({ rank: r, suit: s });
		});
	});

	function randomCardNumbers() {
		let pairs: Partial<card_type>[] = [];
		$cards.forEach((card) => {
			if (pairs.length == 0) pairs = structuredClone(pair_list);
            if(["blue.png", "brown.png", "gun.png"].includes(card.border)) {
                let pair = pairs.splice(Math.floor(Math.random() * pairs.length), 1)[0];
                if (card.id) updateCard(card.id, pair);
            }
		});
	}

    async function downloadAll() {
        let zip = new JSZip();
        
        for(const card of $cards) {
			let cardElement = document.getElementById(`card${card.id}`);
			if(!cardElement) return;

            let dataUrl = await toPng(cardElement);
			let res = await fetch(dataUrl);
			let blob = await res.blob();
            zip.file(`${card.id}.png`, blob);
		}
        
        zip.generateAsync({type: "blob"})
        .then(function(content) {
            //saveAs(content, "example.zip");
            let link = document.createElement('a');
			link.href = URL.createObjectURL(content);            ;
			link.download = `cards.zip`;
			link.click();
        });
    }
</script>

<div class="join join-vertical sm:join-horizontal">
	<button class="join-item btn btn-neutral" onclick={randomCardNumbers}>
		Random numbers
		<i class="fa-solid fa-shuffle"></i>
	</button>
	<button class="join-item btn btn-success" onclick={() => addCard()}>
		Add new card
		<i class="fa-regular fa-square-plus"></i>
	</button>
    <button class="join-item btn btn-info" onclick={downloadAll}>
        Download all
        <i class="fa-regular fa-file-zipper"></i>
    </button>
</div>

{#if $cards}
	<div class="flex flex-wrap gap-8 mt-4 justify-center">
		{#each $cards as card}
			<Card symbol_files={data.symbols} border_files={data.borders} {card} />
		{/each}
	</div>
{/if}
