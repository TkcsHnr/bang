<script lang="ts">
	import { onMount } from 'svelte';
	import { toPng } from 'html-to-image';
	import { default_card, type card_type, updateCard, deleteCard } from './db';

	export let symbol_files: string[] = [];
	export let border_files: string[] = [];
	const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	const suits = ['heart', 'diamond', 'club', 'spade'];
	const suit_map: { [s: string]: string } = {
		heart: '♥',
		diamond: '♦',
		club: '♣',
		spade: '♠'
	};

	let hitbox = false;

	export let card: card_type = default_card;

	let titleElement: HTMLInputElement;
	let descElement: HTMLElement;
	let symbolModal: HTMLDialogElement;
	let borderModal: HTMLDialogElement;
	let cardElement: HTMLDivElement;

	function adjustTitle() {
		if (!titleElement) return;
		titleElement.value = titleElement.value.toUpperCase();
		let size = 11 + 1;
		do {
			size--;
			titleElement.style.fontSize = size + 'mm';
		} while (titleElement.scrollWidth > titleElement.clientWidth && size > 1);
	}
	function adjustDesc() {
		if (!descElement) return;
		let size = 12 + 1;
		do {
			size--;
			descElement.style.fontSize = size + 'px';
		} while (
			(descElement.scrollHeight > descElement.clientHeight ||
				descElement.scrollWidth > descElement.clientWidth) &&
			size > 1
		);
	}
	function handleFileChange(event: any) {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		const reader = new FileReader();
		reader.onloadend = () => {
			console.log(card.id);
			if (card.id) updateCard(card.id, { imageUrl: reader.result?.toString() || card.imageUrl });
		};
		reader.readAsDataURL(selectedFile);
	}

	function addSymbol(symbol: string) {
		if (!card.id) return;
		updateCard(card.id, { symbols: [...card.symbols, symbol] });
	}
	function removeSymbol(index: number) {
		if (!card.id) return;

		card.symbols.splice(index, 1);
		updateCard(card.id, { symbols: card.symbols });
	}
	function removeSymbols() {
		if (!card.id) return;
		updateCard(card.id, { symbols: [] });
	}
	function updateBorder(border: string) {
		if (!card.id) return;
		updateCard(card.id, { border: border });
	}
	function updateDescEnable() {
		if (!card.id) return;
		updateCard(card.id, { descEnable: !card.descEnable });
	}
	function updateRank() {
		if (!card.id) return;
		updateCard(card.id, { rank: card.rank });
	}
	function updateSuit() {
		if (!card.id) return;
		updateCard(card.id, { suit: card.suit });
	}
	function updateTitle() {
		card.title = card.title.toUpperCase();

		if (!card.id) return;
		updateCard(card.id, { title: card.title });

		adjustTitle();
	}
	function updateDesc() {
		if (!card.id) return;
		updateCard(card.id, { description: card.description });

		adjustDesc();
	}
	function removeCard() {
		if (!card.id) return;
		deleteCard(card.id);
	}
	function updateLives() {
		if (!card.id) return;
		updateCard(card.id, { lives: card.lives });
	}

	function downloadCard() {
		toPng(cardElement).then(function (dataUrl) {
			let link = document.createElement('a');
			link.download = `${card.title.toLowerCase()}.png`;
			link.href = dataUrl;
			link.click();
		});
	}
	onMount(() => {
		adjustTitle();
		adjustDesc();
	});
</script>

<!-- <input type="checkbox" class="toggle" bind:checked={hitbox} /> -->

<dialog bind:this={symbolModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Choose symbol to add</h3>
		<form method="dialog" class="flex flex-wrap gap-4 mt-4 w-full">
			{#each symbol_files as symbol}
				<button class="btn btn-neutral w-fit" onclick={() => addSymbol(symbol)}>
					<img src="/symbols/{symbol}" alt={symbol} class="h-8" />
				</button>
			{/each}
			<button class="btn btn-error" onclick={removeSymbols}
				>Remove all symbols from this card</button
			>
		</form>
	</div>
</dialog>

<dialog bind:this={borderModal} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="text-lg font-bold">Choose border</h3>
		<form method="dialog" class="flex flex-wrap gap-4 mt-4 w-full">
			{#each border_files as b}
				<button class="btn h-fit p-0 relative" onclick={() => updateBorder(b)}>
					<img src="/borders/{b}" alt={b} class="w-24" />
					<span class="absolute mx-auto my-auto">{b.replace('.png', '')}</span>
				</button>
			{/each}
		</form>
	</div>
</dialog>

<div class="flex items-center flex-row-reverse">
	<div class="join join-vertical">
		<button
			class="btn join-item btn-sm {card.descEnable
				? 'btn-neutral'
				: 'btn-ghost border border-base-content border-opacity-20'} !rounded-tl-none"
			onclick={updateDescEnable}
			aria-label="description"
		>
			<i class="fa-solid fa-file-lines"></i>
			<i class="fa-solid {card.descEnable ? 'fa-check' : 'fa-xmark'}"></i>
		</button>
		{#if ['blue.png', 'brown.png', 'gun.png'].includes(card.border)}
			<select
				class="join-item select select-bordered select-sm text-base"
				bind:value={card.rank}
				onchange={updateRank}
			>
				{#each ranks as r}
					<option value={r}>{r}</option>
				{/each}
			</select>
			<select
				class="join-item select select-bordered select-sm text-base"
				bind:value={card.suit}
				onchange={updateSuit}
			>
				{#each suits as s}
					<option value={s}>{suit_map[`${s}`]}</option>
				{/each}
			</select>
		{/if}
		{#if card.border == 'character.png'}
			<select
				class="font-[fontAwesome] join-item select select-bordered select-sm text-xs"
				bind:value={card.lives}
				onchange={updateLives}
			>
				{#each { length: 7 } as _, l}
					<option value={l + 1}>
						{l + 1} &#xf004;
					</option>
				{/each}
			</select>
		{/if}
		<button
			class="btn btn-sm btn-neutral city-20 join-item h-fit"
			onclick={() => symbolModal.showModal()}
		>
			<img src="/symbols/anyone.png" alt="symbols" class="w-8" />
		</button>
		<button class="btn btn-sm btn-info join-item" aria-label="download" onclick={downloadCard}>
			<i class="fa-solid fa-download"></i>
		</button>
		<button
			class="btn btn-sm btn-error !rounded-bl-none join-item"
			aria-label="remove"
			onclick={removeCard}
		>
			<i class="fa-solid fa-trash"></i>
		</button>
	</div>

	<div class="gamecard" id="card{card.id}" bind:this={cardElement}>
		<div class="content" class:hitbox>
			<input
				autocomplete="off"
				name="title"
				class="title"
				class:hitbox
				bind:this={titleElement}
				bind:value={card.title}
				oninput={updateTitle}
			/>
			<div class="hero" class:hitbox>
				<img src={card.imageUrl} alt="hero" />
				<div class="block"></div>
				<input
					type="file"
					id="img{card.id}"
					accept="image"
					class="hidden"
					onchange={handleFileChange}
				/>
				<label for="img{card.id}" class="upload">Upload picture</label>
			</div>
			<div class="description" class:hitbox>
				{#each card.symbols as symbol, i}
					<button onclick={() => removeSymbol(i)} class="contents">
						<img src="/symbols/{symbol}" alt={symbol} class:hitbox />
					</button>
				{/each}
				{#if card.descEnable}
					<div
						contenteditable
						bind:textContent={card.description}
						oninput={updateDesc}
						class="text {card.symbols.length > 0 ? 'text-left' : 'text-center justify-center'}"
						bind:this={descElement}
					>
						{card.description}
					</div>
				{/if}
			</div>
			{#if ['blue.png', 'brown.png', 'gun.png'].includes(card.border)}
				<div class="corner" class:hitbox>
					<p>{card.rank}</p>
					<img src="/symbols/{card.suit}.png" alt={card.suit} />
				</div>
			{/if}
		</div>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<img
			onclick={() => borderModal.showModal()}
			alt="border"
			src="/borders/{card.border}"
			class="absolute h-full cursor-pointer hover:scale-[1.02]"
		/>
		{#if card.border == 'character.png'}
			<div class="lives">
				{#each { length: card.lives } as _}
					<img src="/symbols/bullet.png" alt="hp" />
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.hitbox {
		border: 1px solid red;
	}
	.gamecard {
		width: 56mm;
		height: 87mm;
		background-color: white;
		border-radius: 20px;
		overflow: hidden;
		position: relative;
		display: flex;
		color: black;
	}
	.content {
		width: 44mm;
		height: 75mm;
		margin: 6mm;
		padding: 1mm;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1mm;
		position: relative;
		z-index: 10;
	}
	.title {
		width: 100%;
		height: 11mm;
		min-height: 11mm;
		line-height: 11mm;
		text-align: center;
		font-family: 'Perdido';
		white-space: nowrap;
		background-color: transparent;
		transition: background-color 0.2s;
	}
	.title:hover {
		background-color: #ccc;
	}
	.hero {
		aspect-ratio: 1;
		position: relative;
	}
	.hero .block {
		width: 100%;
		position: absolute;
		bottom: 0px;
		top: 0px;
		box-shadow: 0 0 2mm 2mm white inset;
		transform: scale(1.025);
	}
	.hero img {
		object-fit: cover;
		width: 100%;
		height: 100%;
		object-position: center;
		box-shadow: 0 0 8px 8px white inset;
	}
	.upload {
		width: 100%;
		height: 100%;
		opacity: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s;
		cursor: pointer;
		font-family: 'Palatino';
		color: white;
	}
	.upload:hover {
		opacity: 1;
		backdrop-filter: brightness(25%) blur(2px);
	}
	.description {
		width: 100%;
		height: 100%;
		margin-bottom: 2mm;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 2mm;
		position: relative;
	}
	.description img {
		max-height: 80%;
		width: auto;
		min-width: 8mm;
		max-width: 100%;
	}
	.description img:hover {
		filter: blur(1px) grayscale();
		transform: scale(0.9);
	}
	.text {
		font-family: 'Palatino';
		height: 100%;
		min-width: 20mm;
		line-height: 1.25;
		overflow: hidden;
		display: flex;
		align-items: center;
		transition: background-color 0.2s;
	}
	.text:hover {
		background-color: #ccc;
	}
	.corner {
		position: absolute;
		left: -2.5mm;
		bottom: -3mm;
		height: 6mm;
		display: flex;
		align-items: baseline;
		gap: 0.5mm;
	}
	.corner p {
		font-size: 6mm;
		line-height: 6mm;
		font-family: 'Palatino';
		-webkit-text-stroke: 2px white;
		paint-order: stroke fill;
	}
	.corner img {
		height: 4mm;
		filter: drop-shadow(1px 0 0 white) drop-shadow(-0.5px 0 0 white) drop-shadow(0 1px 0 white)
			drop-shadow(0 -0.5px 0 white);
	}
	.lives {
		position: absolute;
		right: 1mm;
		top: 16mm;
		display: flex;
		flex-direction: column;
	}
	.lives img {
		width: 8mm;
		z-index: 20;
		margin-bottom: -1mm;
	}
</style>
