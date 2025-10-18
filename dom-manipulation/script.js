// --- DATA ---
// Step 2: Manage an array of quote objects
const quotes = [
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

// --- FUNCTIONS ---

/**
 * Step 2: Implement a function to display a random quote.
 * This function selects a random quote and updates the DOM to display it.
 */
function showRandomQuote() {
    // Fade out the old quote for a smoother transition
    quoteDisplay.style.opacity = 0;

    setTimeout(() => {
        // Get a random quote from the array
        const randomIndex = Math.floor(Math.random() * quotes.length);
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

// --- INITIALIZATION ---

// Add a listener to ensure the DOM is fully loaded before running our script
document.addEventListener('DOMContentLoaded', () => {
    // Display the first random quote when the page loads
    showRandomQuote();
    
    // Dynamically create the form to add new quotes
    createAddQuoteForm();

    // Attach the event listener to the "Show New Quote" button
    newQuoteBtn.addEventListener('click', showRandomQuote);
});
