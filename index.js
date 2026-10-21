// Initialize an empty array to store items
let items = [];

// Get references to the DOM elements
const itemsDiv = document.getElementById("items");
const input = document.getElementById("itemInput");
const storageKey = "items";

// Function to render items in the DOM
function renderItems() {
    // Clear the contents of the itemsDiv
    itemsDiv.innerHTML = "";

    // Iterate over the items and create DOM elements for each
    for (const [idx, item] of Object.entries(items)) {
        const container = document.createElement("div");
        container.style.marginBottom = "10px";
        
        const text = document.createElement("p");
        text.style.display = "inline";
        text.style.marginRight = "10px";
        // Use textContent to prevent XSS
        text.textContent = item;

        const button = document.createElement("button");
        button.textContent = "Delete";
        // Convert idx to a number before using it in splice
        button.onclick = () => removeItem(Number(idx));
        
        container.appendChild(text);
        container.appendChild(button);
        
        itemsDiv.appendChild(container);
    }
}

// Function to load items from local storage
function loadItems() {
    const oldItems = localStorage.getItem(storageKey);
    if (oldItems) items = JSON.parse(oldItems);
    renderItems();
}

// Function to save items to local storage
function saveItems() {
    const stringItems = JSON.stringify(items);
    localStorage.setItem(storageKey, stringItems);
}

// Function to add a new item
function addItem() {
    const value = input.value.trim(); // Trim whitespace from input
    // Validate input to ensure it is not empty and meets criteria
    if (!value) {
        alert("You cannot add an empty item");
        return;
    }
    items.push(value);
    renderItems();
    input.value = "";
    saveItems();
}

// Function to remove an item by index
function removeItem(idx) {
    items.splice(idx, 1);
    renderItems();
    saveItems();
}

// Ensure DOM elements exist before proceeding
if (itemsDiv && input) {
    // Load items when the document is fully loaded
    document.addEventListener("DOMContentLoaded", loadItems);
} else {
    console.error("Required DOM elements are missing.");
}