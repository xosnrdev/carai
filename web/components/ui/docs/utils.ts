export { addActivityListeners, removeActivityListeners };

function addActivityListeners(handler: () => void) {
    window.addEventListener("mousemove", handler);
    window.addEventListener("click", handler);
    window.addEventListener("keypress", handler);
}

function removeActivityListeners(handler: () => void) {
    window.removeEventListener("mousemove", handler);
    window.removeEventListener("click", handler);
    window.removeEventListener("keypress", handler);
}
