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
const categoryFilter = document.getElementById('categoryFilter'); // === STEP 2.1 ===
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
 * === STEP 2.2: MODIFIED showRandomQuote ===
 * This function now filters quotes based on the selected category
 * before displaying a random one.
 */
function showRandomQuote() {
    // Fade out the old quote for a smoother transition
    quoteDisplay.style.opacity = 0;

    // Get the currently selected category
    const selectedCategory = categoryFilter.value;

    // Filter the quotes array
    const filteredQuotes = (selectedCategory === 'all')
        ? quotes
        : quotes.filter(quote => quote.category === selectedCategory);

    setTimeout(() => {
        if (!filteredQuotes.length) {
            let message = 'No quotes available. Add one!';
            if (selectedCategory !== 'all') {
                message = `No quotes found in category: "${selectedCategory}"`;
            }
            quoteDisplay.innerHTML = `<p>${message}</p>`;
            quoteDisplay.style.opacity = 1;
            return;
        }

        // Get a random quote *from the filtered list*
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];

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

        // Fade in the new quote
        quoteDisplay.style.opacity = 1;
    }, 300); // Delay matches the fade-out time
}

/**
 * === STEP 2.3: MODIFIED addQuote ===
 * Now updates the category filter dropdown if a new category is added.
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

        // === STEP 2.3: Update categories in dropdown ===
        populateCategories();

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

// === STEP 2.2: NEW FUNCTION populateCategories ===
/**
 * Dynamically populates the category filter dropdown with unique categories.
 */
function populateCategories() {
    // Keep track of the currently selected value
    const currentFilter = categoryFilter.value;

    // Get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.sort(); // Sort alphabetically

    // Clear existing options (but keep "All Categories")
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Add an option for each unique category
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    // Restore the previously selected filter, if it still exists
    // This prevents the filter from resetting when a new quote is added
    if (Array.from(categoryFilter.options).some(opt => opt.value === currentFilter)) {
        categoryFilter.value = currentFilter;
    }
}

// === STEP 2.2: NEW FUNCTION filterQuotes ===
/**
 * Handles the change event from the category filter.
 * Saves the filter preference and shows a new quote.
 */
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    
    // === STEP 2.2: Remember the last selected filter in localStorage ===
    try {
        localStorage.setItem('lastCategoryFilter', selectedCategory);
    } catch (err) {
        console.warn('Failed to save filter preference to localStorage:', err);
    }
    
    // Show a random quote based on the new filter
    showRandomQuote();
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

/**
 * === STEP 2.3: MODIFIED importFromJsonFile ===
 * Now updates the category filter after importing new quotes.
 */
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
            
            // === STEP 2.3: Update categories after import ===
            populateCategories(); 

            alert(`Imported ${valid.length} quotes successfully!`);
            showRandomQuote(); // Show a new random quote (respecting filter)
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

    // Dynamically create the form to add new quotes
    createAddQuoteForm();

    // === STEP 2.2: Populate category filter on load ===
    populateCategories();

    // === STEP 2.2: Restore last filter preference from localStorage ===
    try {
        const lastFilter = localStorage.getItem('lastCategoryFilter');
        if (lastFilter) {
            // Check if the saved filter value actually exists as an option
            if (Array.from(categoryFilter.options).some(opt => opt.value === lastFilter)) {
                categoryFilter.value = lastFilter;
            }
        }
    } catch (err) {
        console.warn('Failed to load filter preference:', err);
    }

    // Display the first random quote (will now respect the filter)
    showRandomQuote();
    
    // Attach the event listener to the "Show New Quote" button
    newQuoteBtn.addEventListener('click', showRandomQuote);
    
    // === STEP 2.2: Attach event listener for the filter ===
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterQuotes);
    }

    // Attach export/import handlers
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportToJson);
    if (importFileInput) importFileInput.addEventListener('change', importFromJsonFile);
});