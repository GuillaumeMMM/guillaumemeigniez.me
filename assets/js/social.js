const images = document.querySelectorAll('.social-publication-list-item-image');
const alreadyLoaded = new Set();
for (const image of images) {
    image.addEventListener('mouseover', (e) => {
        const url800 = `/social/${e.target.id}/${e.target.src.split('/img/')[1].split('-400.webp')[0]}-800.webp`
        if (!alreadyLoaded.has(url800)) {
            preloadImage(url800);
        }
    })
}
function preloadImage(url) {
    var img = new Image();
    img.src = url;
    alreadyLoaded.add(url)
}