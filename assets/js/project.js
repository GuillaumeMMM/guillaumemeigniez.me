const dialog = document.getElementById('image-dialog');
const dialogImage = dialog.querySelector('.image-dialog-image');
const imageButtons = [...document.querySelectorAll('.project-image-button')];
let currentIndex = 0;

function showImage(index) {
    currentIndex = (index + imageButtons.length) % imageButtons.length;
    const img = imageButtons[currentIndex].querySelector('img');

    dialogImage.removeAttribute('srcset');
    dialogImage.removeAttribute('src');

    const width = Number(img.getAttribute('width'));
    const height = Number(img.getAttribute('height'));
    dialogImage.style.setProperty('--image-aspect', width / height);
    dialogImage.style.setProperty('--image-width', `${width}px`);
    dialogImage.classList.add('is-loading');

    dialogImage.alt = img.alt;
    dialogImage.srcset = img.srcset;
    dialogImage.src = img.src;
}

imageButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        showImage(index);
        dialog.showModal();
    });
});

dialog.querySelector('.image-dialog-previous')?.addEventListener('click', () => showImage(currentIndex - 1));
dialog.querySelector('.image-dialog-next')?.addEventListener('click', () => showImage(currentIndex + 1));

dialog.addEventListener('keydown', (e) => {
    if (imageButtons.length < 2) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
});

dialog.addEventListener('close', () => imageButtons[currentIndex].focus());

for (const event of ['load', 'error']) {
    dialogImage.addEventListener(event, () => dialogImage.classList.remove('is-loading'));
}

dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
        dialog.close();
    }
});
