// --- DATA ---
// Step 2: Manage an array of quote objects
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Technology" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Wisdom" },
    { text: "The mind is everything. What you think you become.", category: "Philosophy" },
    { text: "Your time is limited, so don't waste it living someone else's life.", category: "Life" }
];

// --- DOM ELEMENT REFERENCES ---
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteContainer = document.getElementById('addQuoteContainer');
// storage controls
const exportJsonBtn = document.getElementById('exportJson');
const importFileInput = document.getElementById('importFile');

// --- STORAGE HELPERS ---
function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (err) {
        console.error('Failed to save quotes to localStorage:', err);
    }
}

function loadQuotes() {
    try {
        const stored = localStorage.getItem('quotes');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length) {
                quotes = parsed;
            }
        }
    } catch (err) {
        console.error('Failed to load quotes from localStorage:', err);
    }
}

// --- FUNCTIONS ---

/**
 * Step 2: Implement a function to display a random quote.
 * This function selects a random quote and updates the DOM to display it.
 */
function showRandomQuote() {
    // Fade out the old quote for a smoother transition
    quoteDisplay.style.opacity = 0;

    setTimeout(() => {
        if (!quotes.length) {
            quoteDisplay.innerHTML = '<p>No quotes available. Add one!</p>';
            quoteDisplay.style.opacity = 1;
            return;
        }

        // Try to reuse last viewed index from sessionStorage if present
        let randomIndex;
        const lastIndex = sessionStorage.getItem('lastIndex');
        if (lastIndex !== null && Math.random() < 0.3) {
            // 30% chance to show last viewed quote for demonstration
            randomIndex = parseInt(lastIndex, 10);
            if (isNaN(randomIndex) || randomIndex < 0 || randomIndex >= quotes.length) {
                randomIndex = Math.floor(Math.random() * quotes.length);
            }
        } else {
            randomIndex = Math.floor(Math.random() * quotes.length);
        }

        const quote = quotes[randomIndex];

        // Clear any existing content
        quoteDisplay.innerHTML = '';

        // Create new elements for the quote text and category
        const quoteTextElement = document.createElement('p');
        quoteTextElement.textContent = `"${quote.text}"`;

        const quoteCategoryElement = document.createElement('span');
        quoteCategoryElement.textContent = `- ${quote.category}`;

        // Append new elements to the display area
        quoteDisplay.appendChild(quoteTextElement);
        quoteDisplay.appendChild(quoteCategoryElement);

        // Save last viewed index to sessionStorage
        try {
            sessionStorage.setItem('lastIndex', String(randomIndex));
        } catch (err) {
            console.warn('sessionStorage unavailable:', err);
        }

        // Fade in the new quote
        quoteDisplay.style.opacity = 1;
    }, 300); // Delay matches the fade-out time
}

/**
 * Step 3: Implement a function to dynamically add a new quote to our array.
 */
function addQuote() {
    const newQuoteTextInput = document.getElementById('newQuoteText');
    const newQuoteCategoryInput = document.getElementById('newQuoteCategory');

    const text = newQuoteTextInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();

    if (text && category) {
        // Create a new quote object
        const newQuote = { text, category };

        // Add it to the quotes array
        quotes.push(newQuote);

        // Persist to localStorage
        saveQuotes();

        // Clear the input fields
        newQuoteTextInput.value = '';
        newQuoteCategoryInput.value = '';

        // Display a success message
        quoteDisplay.innerHTML = ''; // Clear current
        const successMsg = document.createElement('p');
        successMsg.textContent = 'New quote added successfully!';
        successMsg.style.color = '#10b981'; // Green color
        quoteDisplay.appendChild(successMsg);

        setTimeout(showRandomQuote, 1500); // Show a random quote after a short delay

    } else {
        alert('Please fill in both the quote and its category.');
    }
}

/**
 * Step 2 & 3: Create and append the form for adding a new quote using DOM manipulation.
 */
function createAddQuoteForm() {
    // Create a heading for the form section
    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Add Your Own Quote';

    // Create the input for the new quote text
    const newQuoteTextInput = document.createElement('input');
    newQuoteTextInput.id = 'newQuoteText';
    newQuoteTextInput.type = 'text';
    newQuoteTextInput.placeholder = 'Enter a new quote';

    // Create the input for the new quote category
    const newQuoteCategoryInput = document.createElement('input');
    newQuoteCategoryInput.id = 'newQuoteCategory';
    newQuoteCategoryInput.type = 'text';
    newQuoteCategoryInput.placeholder = 'Enter quote category';

    // Create the "Add Quote" button
    const addQuoteBtn = document.createElement('button');
    addQuoteBtn.textContent = 'Add Quote';
    
    // Add event listener directly to the button
    addQuoteBtn.addEventListener('click', addQuote);
    
    // Append all created elements to the container
    addQuoteContainer.appendChild(formTitle);
    addQuoteContainer.appendChild(newQuoteTextInput);
    addQuoteContainer.appendChild(newQuoteCategoryInput);
    addQuoteContainer.appendChild(addQuoteBtn);
}

// --- IMPORT / EXPORT FUNCTIONS ---

function exportToJson() {
    try {
        const dataStr = JSON.stringify(quotes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Export failed:', err);
        alert('Export failed. See console for details.');
    }
}

function importFromJsonFile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = function(ev) {
        try {
            const imported = JSON.parse(ev.target.result);
            if (!Array.isArray(imported)) throw new Error('JSON must be an array');

            // Validate and merge
            const valid = imported.filter(item => item && typeof item.text === 'string' && typeof item.category === 'string');
            if (!valid.length) {
                alert('No valid quotes found in imported file.');
                return;
            }

            quotes.push(...valid);
            saveQuotes();
            alert(`Imported ${valid.length} quotes successfully!`);
            showRandomQuote();
        } catch (err) {
            console.error('Import failed:', err);
            alert('Failed to import JSON: ' + err.message);
        } finally {
            // reset input so same file can be re-imported if needed
            importFileInput.value = '';
        }
    };
    fileReader.readAsText(file);
}

// --- INITIALIZATION ---

// Add a listener to ensure the DOM is fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {
    // Load quotes from localStorage if present
    loadQuotes();

    // Display the first random quote when the page loads
    // If sessionStorage has lastIndex, try to display that one
    showRandomQuote();
    
    // Dynamically create the form to add new quotes
    createAddQuoteForm();

    // Attach the event listener to the "Show New Quote" button
    newQuoteBtn.addEventListener('click', showRandomQuote);

    // Attach export/import handlers
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportToJson);
    if (importFileInput) importFileInput.addEventListener('change', importFromJsonFile);
});
