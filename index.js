/**
 * Simple item list manager with persistent storage.
 * 
 * Features:
 * - Add and remove items from a list.
 * - Items are persisted in localStorage.
 * - Handles missing DOM elements and corrupted storage gracefully.
 * - Input is validated and sanitized before use.
 * 
 * Security Notes:
 * - Always use textContent when rendering user input to the DOM.
 * - Do not use innerHTML with unsanitized input to prevent XSS.
 */

const STORAGE_KEY = "items"; // Storage key moved to a constant for maintainability

let items = [];

// Get DOM elements and check for null references
const itemsDiv = document.getElementById("items");
const input = document.getElementById("itemInput");

if (!itemsDiv || !input) {
    // Handle missing DOM elements gracefully
    console.error("Required DOM elements not found. Please check your HTML.");
    // Optionally, display a user-friendly message
    if (document.body) {
        const errorMsg = document.createElement("div");
        errorMsg.style.color = "red";
        errorMsg.textContent = "Application error: Required elements missing from the page.";
        document.body.appendChild(errorMsg);
    }
    // Prevent further execution
} else {

    /**
     * Render the list of items to the DOM.
     * Uses textContent to prevent XSS.
     */
    function renderItems() {
        itemsDiv.innerHTML = ""; // Clear previous items

        // Use forEach for idiomatic array iteration
        items.forEach((item, idx) => {
            const container = document.createElement("div");
            container.style.marginBottom = "10px";

            const text = document.createElement("p");
            text.style.display = "inline";
            text.style.marginRight = "10px";
            // SECURITY: Always use textContent to avoid XSS. Do NOT use innerHTML with unsanitized input.
            text.textContent = item;

            const button = document.createElement("button");
            button.textContent = "Delete";
            button.onclick = () => removeItem(idx);

            container.appendChild(text);
            container.appendChild(button);

            itemsDiv.appendChild(container);
        });
    }

    /**
     * Load items from localStorage.
     * Handles corrupted or invalid JSON gracefully.
     */
    function loadItems() {
        const oldItems = localStorage.getItem(STORAGE_KEY);
        if (oldItems) {
            try {
                const parsed = JSON.parse(oldItems);
                // Ensure parsed value is an array
                if (Array.isArray(parsed)) {
                    items = parsed;
                } else {
                    items = [];
                }
            } catch (e) {
                // Handle corrupted storage gracefully
                console.error("Failed to parse items from storage. Resetting list.", e);
                items = [];
                // Optionally, notify the user
                alert("Stored data was corrupted and has been reset.");
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        renderItems();
    }

    /**
     * Save items to localStorage.
     */
    function saveItems() {
        const stringItems = JSON.stringify(items);
        localStorage.setItem(STORAGE_KEY, stringItems);
    }

    /**
     * Add a new item to the list.
     * Validates input: trims whitespace, checks for empty and duplicates.
     */
    function addItem() {
        let value = input.value.trim();
        if (!value) {
            alert("You cannot add an empty item.");
            return;
        }
        // Prevent duplicate items (case-insensitive)
        if (items.some(existing => existing.toLowerCase() === value.toLowerCase())) {
            alert("This item already exists in the list.");
            return;
        }
        items.push(value);
        renderItems();
        input.value = "";
        saveItems();
    }

    /**
     * Remove an item from the list by index.
     * Ensures idx is a number.
     * @param {number} idx 
     */
    function removeItem(idx) {
        idx = Number(idx); // Ensure idx is a number
        if (!Number.isInteger(idx) || idx < 0 || idx >= items.length) {
            // Invalid index, do nothing
            return;
        }
        items.splice(idx, 1);
        renderItems();
        saveItems();
    }

    // Attach event listeners
    document.addEventListener("DOMContentLoaded", loadItems);

    // Optionally, you may want to attach addItem to a button or form submit event
    // Example:
    // document.getElementById("addButton").onclick = addItem;
}