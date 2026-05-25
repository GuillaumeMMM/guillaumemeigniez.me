const atls = [
    'Mediterranean landscape',
    'Sunset in the dark from the inside of an apartment',
    'Sea foam hitting black rocks',
    'Green seaweed on black rocks',
    'Human figure casting light in front of a dark seaside landscape',
    'Multicolor contemporary art construction',
    'Corner of a New York city street at sunrise',
    'Red sunset sky in Baltimore harbor',
    'Hiking cottage viewed from above in the Alps mountains',
    'Mountain chain in the Alps'
]
const images = Array(10).fill(null).map((_, i) => `image_${i + 1
    }.webp`);
function getDefaultImageIndex(excluded) {
    let random = Math.trunc(Math.random() * images.length);
    if (random === excluded) {
        random = (random + 1) % images.length;
    }
    return random
}
let nextDisplayedIndex = getDefaultImageIndex(0);
preloadImage(`/assets/img/${images[nextDisplayedIndex]
    }`);
function updateDisplayedImage() {
    let displayedImageIndex = nextDisplayedIndex;
    document.getElementById('cover-image').src = `/assets/img/${images[displayedImageIndex]
        }`;
    document.getElementById('cover-image').alt = atls[displayedImageIndex]
    nextDisplayedIndex = getDefaultImageIndex(displayedImageIndex);
    preloadImage(`/assets/img/${images[nextDisplayedIndex]
        }`);
};
const links = document.querySelectorAll('.description a');
links.forEach((link, i) => {
    link.addEventListener('pointerenter', () => {
        updateDisplayedImage();
    })
    link.addEventListener('focus', () => {
        updateDisplayedImage();
    })
})
function preloadImage(url) {
    var img = new Image();
    img.src = url;
}