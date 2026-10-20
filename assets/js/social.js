const images = document.querySelectorAll('.social-publication-list-item-image');
const alreadyLoaded = new Set();
for (const image of images) {
    image.addEventListener('mouseenter', (e) => {
        const img = e.currentTarget.querySelector('img');
        const url800 = `/social/${img.id}/${img.src.split('/image/')[1].split('-400.webp')[0]}-800.webp`
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