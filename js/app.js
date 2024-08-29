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
		const itemFull = selectAll('.item-full');

		offset.y > 50
			? gsap.to(heading, { opacity: 0 })
			: gsap.to(heading, { opacity: 1 });

		gsap.to(itemFull, { y: -offset.y, duration: 0 });
	});

	const setPositionCalculation = () => {
		const containerFull = select('.item-container-full');
		const containerTrasparent = select('.item-container-transparent');
		const scrollContent = select('.scroll-content');

		const scrollContenHeight = DATA.length * (ITEM_SIZE + PADDING);
		const multiplyTime = window.innerHeight / (ITEM_SIZE + PADDING) - 2;

		gsap.set(scrollContent, {
			blockSize: scrollContenHeight + ITEM_SIZE * multiplyTime + ITEM_SIZE,
		});
		gsap.set(containerFull, { top: ITEM_SIZE * multiplyTime });
		gsap.set(containerTrasparent, { y: ITEM_SIZE * multiplyTime });
	};

	window.addEventListener('resize', setPositionCalculation());

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
		content.appendChild(picture);
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

	const iniObserver = () => {
		const picturesList = selectAll('.img-select');

		let options = {
			root: verticalScrollbar.containerEl,
			rootMargin: ` ${ITEM_SIZE}px 0px -${ITEM_SIZE}px 0px `,
			threshold: 0.4,
		};

		let observer = new IntersectionObserver((entries, _) => {
			entries.forEach(entry => {
				entry.isIntersecting
					? animate(entry, picturesList, 'in')
					: animate(entry, picturesList, 'out');
			});
		}, options);

		verticalScrollbar.containerEl
			.querySelectorAll('.item-transparent')
			.forEach(item => observer.observe(item));
	};

	const animate = (entry, pictireList, dir) => {
		const target = pictireList[entry.target.dataset.id - 1];

		gsap.to(target, {
			translateY: dir === 'in' ? 0 : 500,
			scale: dir === 'in' ? 1 : 1.5,
			duration: 0.5,
		});
	};

	generateList();
	setPositionCalculation();
	iniObserver();
});
