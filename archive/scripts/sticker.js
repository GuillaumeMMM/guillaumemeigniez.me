let draggingImage = null;
let offsetX = 0;
let offsetY = 0;
const images = document.getElementsByTagName('img');
const container = document.getElementById('drag-container');
const containerRect = container.getBoundingClientRect();
for (const img of images) {
    const rect = img.getBoundingClientRect();
    img.addEventListener('pointerdown', (e) => {
        draggingImage = img;
        offsetX = e.clientX - img.offsetLeft;
        offsetY = e.clientY - img.offsetTop;
        img.setPointerCapture(e.pointerId);
    });
    document.addEventListener('pointermove', (e) => {
        if (!draggingImage)
            return;

        draggingImage.style.left = `${Math.min(Math.max(0, e.clientX - offsetX), containerRect.width - rect.width)
            }px`;
        draggingImage.style.top = `${Math.min(Math.max(0, e.clientY - offsetY), containerRect.height - rect.height)
            }px`;
    });
    document.addEventListener('pointerup', () => {
        draggingImage = null;
    });
    document.addEventListener('pointercancel', () => {
        draggingImage = null;
    });
}