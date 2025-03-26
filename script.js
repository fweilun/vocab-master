// Store vocabulary items in localStorage
let vocabularyItems = JSON.parse(localStorage.getItem('vocabularyItems')) || [];

// DOM Elements
const newWordInput = document.getElementById('newWord');
const addWordButton = document.getElementById('addWord');
const vocabularyList = document.getElementById('vocabularyList');
const groupBySelect = document.getElementById('groupBy');
const sortBySelect = document.getElementById('sortBy');

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Function to add new word
async function addNewWord() {
    const word = capitalizeFirstLetter(newWordInput.value.trim());
    
    if (word) {
        try {
            // Show loading state
            addWordButton.disabled = true;
            addWordButton.textContent = 'Translating...';
            
            // Get translation from API
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ word })
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            const newItem = {
                word: data.word,
                meaning: data.meaning,
                id: Date.now()
            };
            
            vocabularyItems.push(newItem);
            saveToLocalStorage();
            displayVocabulary();
            
            // Clear input
            newWordInput.value = '';
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            // Reset button state
            addWordButton.disabled = false;
            addWordButton.textContent = 'Add Word';
        }
    }
}

// Function to delete word
function deleteWord(id) {
    vocabularyItems = vocabularyItems.filter(item => item.id !== id);
    saveToLocalStorage();
    displayVocabulary();
}

// Function to edit meaning
function editMeaning(id, newMeaning) {
    const item = vocabularyItems.find(item => item.id === id);
    if (item) {
        item.meaning = newMeaning;
        saveToLocalStorage();
        displayVocabulary();
    }
}

// Function to start editing meaning
function startEditingMeaning(meaningElement, id, currentMeaning) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentMeaning;
    input.className = 'meaning-input';
    
    const saveEdit = () => {
        const newMeaning = input.value.trim();
        if (newMeaning) {
            editMeaning(id, newMeaning);
        }
        meaningElement.textContent = newMeaning || currentMeaning;
        meaningElement.classList.remove('editing');
        meaningElement.removeEventListener('blur', saveEdit);
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
    
    meaningElement.textContent = '';
    meaningElement.appendChild(input);
    meaningElement.classList.add('editing');
    input.focus();
}

// Event listeners
addWordButton.addEventListener('click', addNewWord);
newWordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addNewWord();
    }
});

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('vocabularyItems', JSON.stringify(vocabularyItems));
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get group key based on selected grouping
function getGroupKey(item, groupBy) {
    const date = new Date(item.id);
    switch (groupBy) {
        case 'day':
            return date.toLocaleDateString();
        case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            return `Week of ${weekStart.toLocaleDateString()}`;
        case 'month':
            return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        default:
            return 'All Words';
    }
}

// Sort items
function sortItems(items, sortBy) {
    return [...items].sort((a, b) => {
        if (sortBy === 'time') {
            return b.id - a.id;
        } else {
            return a.word.localeCompare(b.word);
        }
    });
}

// Display vocabulary items
function displayVocabulary() {
    const groupBy = groupBySelect.value;
    const sortBy = sortBySelect.value;
    
    // Clear current display
    vocabularyList.innerHTML = '';
    
    // Sort items
    const sortedItems = sortItems(vocabularyItems, sortBy);
    
    // Group items
    const groupedItems = {};
    sortedItems.forEach(item => {
        const groupKey = getGroupKey(item, groupBy);
        if (!groupedItems[groupKey]) {
            groupedItems[groupKey] = [];
        }
        groupedItems[groupKey].push(item);
    });
    
    // Display grouped items
    Object.entries(groupedItems).forEach(([groupKey, items]) => {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        groupHeader.textContent = groupKey;
        vocabularyList.appendChild(groupHeader);
        
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'vocabulary-item';
            
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'content-wrapper';
            
            const wordElement = document.createElement('div');
            wordElement.className = 'word';
            wordElement.textContent = item.word;
            
            const meaningElement = document.createElement('div');
            meaningElement.className = 'meaning';
            meaningElement.textContent = item.meaning;
            meaningElement.style.display = 'none';
            
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = '×';
            deleteButton.onclick = () => deleteWord(item.id);
            
            // Add click event to toggle meaning
            wordElement.onclick = () => {
                meaningElement.style.display = meaningElement.style.display === 'none' ? 'block' : 'none';
            };
            
            // Add click event to edit meaning
            meaningElement.onclick = () => {
                startEditingMeaning(meaningElement, item.id, item.meaning);
            };
            
            contentWrapper.appendChild(wordElement);
            contentWrapper.appendChild(meaningElement);
            itemElement.appendChild(contentWrapper);
            itemElement.appendChild(deleteButton);
            vocabularyList.appendChild(itemElement);
        });
    });
}

// Event listeners for controls
groupBySelect.addEventListener('change', displayVocabulary);
sortBySelect.addEventListener('change', displayVocabulary);

// Initial display
displayVocabulary(); 