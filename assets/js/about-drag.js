const canvas = document.getElementById('canvas');
const sideImage = document.getElementById('side-image');
let sideImageRect = sideImage.getBoundingClientRect();
const sideImageRatio = 9 / 5;
let sideImageHeight = sideImageRect.width / sideImageRatio;
const isSmallSticker = canvas.clientWidth < 400;
const isBigSticker = canvas.clientWidth > 1600;
const stickerWidth = isSmallSticker ? 100 : isBigSticker ? 200 : 150;
const displaySideStickers = canvas.clientWidth > 900;
const pixelizationLimit = 550;

const rawStickers = [
    {
        id: 0,
        ratio: 1,
        bgUrl: 'assets/img/bg13.webp'
    },
    {
        id: 1,
        ratio: 0.89375,
        isMain: true,
        bgUrl: 'assets/img/bg1.webp',
    },
    {
        id: 2,
        ratio: 1.16498,
        bgUrl: 'assets/img/bg11.webp'
    },
    {
        id: 3,
        ratio: 2.3034,
        bgUrl: 'assets/img/bg9.webp'
    },
    {
        id: 4,
        ratio: 0.885,
        isMain: true,
        right: true,
        bgUrl: 'assets/img/bg3.webp'
    },
    {
        id: 5,
        ratio: 0.56,
        widthRatio: 0.9,
        isMain: true,
        right: true,
        bgUrl: 'assets/img/bg0.webp'
    },
    {
        id: 6,
        ratio: 1.8807,
        bgUrl: 'assets/img/bg14.webp'
    },
    {
        id: 7,
        ratio: 0.82,
        isMain: true,
        bgUrl: 'assets/img/bg6.webp'
    },
    {
        id: 8,
        ratio: 0.7581,
        bgUrl: 'assets/img/bg7.webp'
    },
    {
        id: 9,
        ratio: 0.76197,
        isMain: true,
        bgUrl: 'assets/img/bg5.webp'
    },
    {
        id: 10,
        ratio: 1.2309,
        bgUrl: 'assets/img/bg12.webp'
    },
    {
        id: 11,
        ratio: 0.9237,
        bgUrl: 'assets/img/bg10.webp'
    }
]

//  Pick stickers to be displayed
const mainStickersIds = rawStickers.filter(st => st.isMain).map(st => st.id);
const randomStickers = [mainStickersIds[Math.trunc(Math.random() * mainStickersIds.length)]];
while (randomStickers.length < (displaySideStickers ? 4 : 1)) {
    const eligible = rawStickers.filter(s => !randomStickers.includes(s.id) && !s.isMain);
    randomStickers.push(eligible[Math.trunc(Math.random() * eligible.length)].id)
}

const sidePadding = (canvas.clientWidth - sideImageRect.width) / 2;
const availableSpaceWidth = sidePadding - 32;
const availableSpaceHeight = window.innerHeight - 32 - 30;

//  Available positions for stickers
const stickersAvailableSpots = [
    { x: 0, y: 0 },
    { x: 0, y: availableSpaceHeight / 2 },
    { x: canvas.clientWidth - sidePadding, y: 0 },
    { x: canvas.clientWidth - sidePadding, y: availableSpaceHeight / 2 },
]

const stickerPositionFromIndex = Math.trunc(Math.random() * stickersAvailableSpots.length);
const stickers = randomStickers.map(stId => rawStickers.find(rst => rst.id === stId))
    .map((sticker, i) => {
        const offset = isSmallSticker ? 10 : 30;
        const stickerWidthAdapted = stickerWidth * (sticker.widthRatio || 1)
        const stickerPosition = stickersAvailableSpots[(stickerPositionFromIndex + i) % stickersAvailableSpots.length];
        stickerPosition.x += (availableSpaceWidth - stickerWidthAdapted) / 2;

        stickerPosition.y += (availableSpaceHeight / 2 - (stickerWidthAdapted / sticker.ratio)) / 2;
        return {
            ...sticker,
            size: { width: stickerWidthAdapted, height: stickerWidthAdapted / sticker.ratio },
            el: document.getElementById(`sticker_${i}`),
            initialPos: i === 0 ? { x: sticker.right ? sideImageRect.x + sideImageRect.width - offset - stickerWidthAdapted : sideImageRect.x + offset, y: sideImageRect.y + sideImageHeight - (stickerWidthAdapted / sticker.ratio) + offset } : { x: stickerPosition.x, y: stickerPosition.y }
        }
    });

let stickersRects = stickers.map(st => ({ rect: st.el?.getBoundingClientRect(), id: st.id }))


//  Drag and drop of stickers
const mouse = { x: 0, y: 0 }

let draggingId = null;
let offX = 0;
let offY = 0;

stickers.forEach(st => {
    st.el.style.width = `${st.size.width}px`;
    st.el.style.height = `${st.size.height}px`;
    st.el.style.left = `${st.initialPos.x}px`;
    st.el.style.top = `${st.initialPos.y}px`;

    st.el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        draggingId = st.id;
        offX = e.clientX - st.el.offsetLeft;
        offY = e.clientY - st.el.offsetTop;
        st.el.style.cursor = 'grabbing';
    });

    st.el.addEventListener('mouseenter', (e) => {
        preloadImage(st.bgUrl)
    });
})

document.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (draggingId === null) return;

    const sticker = stickers.find(st => st.id === draggingId);
    const maxX = document.documentElement.scrollWidth - sticker.size.width;
    const maxY = document.documentElement.scrollHeight - sticker.size.height - 10;

    sticker.el.style.left = Math.min(Math.max(0, e.clientX - offX), maxX) + 'px';
    sticker.el.style.top = Math.min(Math.max(0, e.clientY - offY), maxY) + 'px';

    stickersRects = stickers.map(st => ({ rect: st.el.getBoundingClientRect(), id: st.id }))
});

document.addEventListener('pointerup', () => {
    draggingId = null;
    stickers.forEach(st => {
        st.el.style.cursor = 'grab';
    })
});

function preloadImage(url) {
    var img = new Image();
    img.src = url;
}
