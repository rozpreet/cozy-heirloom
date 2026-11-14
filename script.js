document.addEventListener("DOMContentLoaded", () => {
    // 1. Pre-fill Order Form when clicking any Gift Package or Collection Card
    const presetButtons = document.querySelectorAll(".select-preset-btn");
    const orderTypeSelect = document.getElementById("order-type");
    const selectedItemSelect = document.getElementById("selected-item");
    const flowerCountSelect = document.getElementById("flower-count");
    const chocoSelect = document.getElementById("add-chocolates");
    const orderSection = document.getElementById("order-section");

    presetButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (orderTypeSelect) orderTypeSelect.value = btn.dataset.type;
            if (selectedItemSelect) selectedItemSelect.value = btn.dataset.choice;
            if (flowerCountSelect) flowerCountSelect.value = btn.dataset.flowers;
            if (chocoSelect) chocoSelect.value = btn.dataset.choco;

            orderSection?.scrollIntoView({ behavior: "smooth" });
        });
    });

    // 2. Wooden / Kraft Box Drag-and-Drop + Wrap Animation
    const stickers = document.querySelectorAll(".floating-sticker");
    const giftBox = document.getElementById("gift-box");
    const tray = document.getElementById("gift-box-items");
    const hint = document.getElementById("box-hint");
    const statusText = document.getElementById("studio-summary");
    const wrapBtn = document.getElementById("wrap-box-btn");
    const clearBtn = document.getElementById("clear-gift");
    const customNotes = document.getElementById("custom-notes");

    let packedItems = [];

    function syncBoxUI() {
        tray.innerHTML = "";
        packedItems.forEach((item, index) => {
            const chip = document.createElement("span");
            chip.className = "box-chip";
            chip.innerHTML = `${item} <button type="button" aria-label="Remove">✕</button>`;
            chip.querySelector("button").addEventListener("click", (e) => {
                e.stopPropagation();
                packedItems.splice(index, 1);
                giftBox.classList.remove("wrapped");
                syncBoxUI();
            });
            tray.appendChild(chip);
        });

        hint.style.display = packedItems.length > 0 ? "none" : "block";
        statusText.textContent = packedItems.length > 0
            ? `${packedItems.length} item(s) inside your box! Click "Wrap Box 🎀" when ready.`
            : "Tap or drag any item above to fill your box!";

        if (packedItems.length > 0) {
            if (orderTypeSelect) orderTypeSelect.value = "Custom Gift Box";
            if (selectedItemSelect) selectedItemSelect.value = "Custom Gift Box";
            if (customNotes) {
                customNotes.value = `My Custom Box Contents: ${packedItems.join(", ")}`;
            }
        }
    }

    function addToBox(name) {
        if (!name) return;
        giftBox.classList.remove("wrapped");
        packedItems.push(name);
        syncBoxUI();
    }
    stickers.forEach((sticker) => {
        const itemName = sticker.dataset.item;
        sticker.addEventListener("click", () => addToBox(itemName));
        sticker.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", itemName);
        });
    });

    if (giftBox) {
        giftBox.addEventListener("dragover", (e) => {
            e.preventDefault();
            giftBox.classList.add("drag-over");
        });
        giftBox.addEventListener("dragleave", () => {
            giftBox.classList.remove("drag-over");
        });
        giftBox.addEventListener("drop", (e) => {
            e.preventDefault();
            giftBox.classList.remove("drag-over");
            addToBox(e.dataTransfer.getData("text/plain"));
        });
    }

    if (wrapBtn) {
        wrapBtn.addEventListener("click", () => {
            if (packedItems.length === 0) {
                statusText.textContent = "Add at least one item to the box before wrapping! ♡";
                return;
            }
            giftBox.classList.toggle("wrapped");
            if (giftBox.classList.contains("wrapped")) {
                wrapBtn.textContent = "Unwrap Box";
                statusText.textContent = "Wrapped with love! Scroll down to complete your order ↓";
                setTimeout(() => {
                    orderSection?.scrollIntoView({ behavior: "smooth" });
                }, 850);
            } else {
                wrapBtn.textContent = "Wrap Box 🎀";
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            packedItems = [];
            giftBox.classList.remove("wrapped");
            if (wrapBtn) wrapBtn.textContent = "Wrap Box 🎀";
            if (customNotes) customNotes.value = "";
            syncBoxUI();
        });
    }
});
