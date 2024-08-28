import { DATA } from './DATA.js';

const PADDING = 8;
const ITEM_SIZE = 182.4 - PADDING;

const select = element => document.querySelector(element);
const selectAll = element => Array.from(document.querySelectorAll(element));
const create = element => document.createElement(element);

window.addEventListener('DOMContentLoaded', () => {
	const content = select('.content');
	const heading = select('.heading');

	const verticalScrollbar = Scrollbar.init(content, {
		damping: 0.03,
		delegateTo: document,
	});

	verticalScrollbar.setPosition(0, 0);
	verticalScrollbar.track.yAxis.element.remove();
	verticalScrollbar.track.xAxis.element.remove();

	verticalScrollbar.addListener(({ offset }) => {
		offset.y > 0
			? gsap.to(heading, { opacity: 0 })
			: gsap.to(heading, { opacity: 1 });
	});

	const generateList = () => {
		const scrollContent = select('.scroll-content');
		const picture = create('div');
		const containerFull = create('div');
		const containerTrasparent = create('div');

		gsap.set(picture, { className: 'picture' });
		gsap.set(containerFull, { className: 'item-container-full' });
		gsap.set(containerTrasparent, { className: 'item-container-transparent' });

		content.appendChild(containerFull);
		scrollContent.insertAdjacentElement('beforeend', containerTrasparent);

		DATA.map(item => {
			const imagen = create('img');

			gsap.set(imagen, {
				className: 'img-select',
				attr: { src: item.imgUrl, 'data-id': item.id },
			});

			picture.appendChild(imagen);
			containerFull.appendChild(createItem(item, false));
			containerTrasparent.appendChild(createItem(item, true));
		});
	};
	const createItem = (item, isTransparent = false) => {
		const itemList = item.title.split(' ');

		const itemContainer = create('div');
		const title = create('div');

		gsap.set(itemContainer, {
			className: ` item ${isTransparent ? 'item-transparent' : 'item-full '} `,
			attr: { 'data-id': item.id },
		});
		gsap.set(title, {
			className: `title ${isTransparent ? 'title-transparent' : 'title-full '}`,
			textContent: itemList[itemList.length - 1],
		});
		itemContainer.appendChild(title);

		return itemContainer;
	};

	generateList();
});
