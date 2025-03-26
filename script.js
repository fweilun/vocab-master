document.addEventListener('DOMContentLoaded', () => {
    const newWordInput = document.getElementById('newWord');
    const addWordButton = document.getElementById('addWord');
    const vocabularyList = document.getElementById('vocabularyList');
    const groupBySelect = document.getElementById('groupBy');
    const sortBySelect = document.getElementById('sortBy');

    // Load vocabulary from localStorage
    let vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || [];

    // Function to save vocabulary to localStorage
    const saveVocabulary = () => {
        localStorage.setItem('vocabulary', JSON.stringify(vocabulary));
    };

    // Function to add a new word
    const addWord = async (word) => {
        if (!word) return;

        // Create new vocabulary item
        const newItem = {
            id: Date.now(),
            word: word,
            meaning: word, // For demo purposes, we'll just use the word itself
            created_at: new Date().toISOString()
        };

        // Add to vocabulary array
        vocabulary.push(newItem);
        saveVocabulary();

        // Clear input
        newWordInput.value = '';

        // Refresh display
        displayVocabulary();
    };

    // Function to delete a word
    const deleteWord = (id) => {
        vocabulary = vocabulary.filter(item => item.id !== id);
        saveVocabulary();
        displayVocabulary();
    };

    // Function to edit a word
    const editWord = (id, newMeaning) => {
        const item = vocabulary.find(item => item.id === id);
        if (item) {
            item.meaning = newMeaning;
            saveVocabulary();
            displayVocabulary();
        }
    };

    // Function to group vocabulary
    const groupVocabulary = (items) => {
        const groupBy = groupBySelect.value;
        const groups = {};

        items.forEach(item => {
            const date = new Date(item.created_at);
            let key;

            switch (groupBy) {
                case 'day':
                    key = date.toLocaleDateString();
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toLocaleDateString();
                    break;
                case 'month':
                    key = `${date.getFullYear()}-${date.getMonth() + 1}`;
                    break;
            }

            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });

        return groups;
    };

    // Function to sort vocabulary
    const sortVocabulary = (items) => {
        const sortBy = sortBySelect.value;
        return [...items].sort((a, b) => {
            if (sortBy === 'time') {
                return new Date(b.created_at) - new Date(a.created_at);
            } else {
                return a.word.localeCompare(b.word);
            }
        });
    };

    // Function to display vocabulary
    const displayVocabulary = () => {
        const sortedVocabulary = sortVocabulary(vocabulary);
        const groupedVocabulary = groupVocabulary(sortedVocabulary);

        vocabularyList.innerHTML = '';

        Object.entries(groupedVocabulary).forEach(([group, items]) => {
            const groupHeader = document.createElement('div');
            groupHeader.className = 'group-header';
            groupHeader.textContent = group;
            vocabularyList.appendChild(groupHeader);

            items.forEach(item => {
                const vocabularyItem = document.createElement('div');
                vocabularyItem.className = 'vocabulary-item';
                vocabularyItem.innerHTML = `
                    <div>
                        <div class="word">${item.word}</div>
                        <div class="meaning" data-id="${item.id}">${item.meaning}</div>
                    </div>
                    <button class="delete-button" data-id="${item.id}">×</button>
                `;

                // Add click event for editing meaning
                const meaningElement = vocabularyItem.querySelector('.meaning');
                meaningElement.addEventListener('click', () => {
                    const currentMeaning = meaningElement.textContent;
                    const input = document.createElement('input');
                    input.value = currentMeaning;
                    input.className = 'edit-input';
                    meaningElement.textContent = '';
                    meaningElement.appendChild(input);
                    input.focus();

                    input.addEventListener('blur', () => {
                        const newMeaning = input.value.trim();
                        if (newMeaning && newMeaning !== currentMeaning) {
                            editWord(item.id, newMeaning);
                        } else {
                            meaningElement.textContent = currentMeaning;
                        }
                    });

                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            input.blur();
                        }
                    });
                });

                // Add click event for delete button
                const deleteButton = vocabularyItem.querySelector('.delete-button');
                deleteButton.addEventListener('click', () => {
                    deleteWord(item.id);
                });

                vocabularyList.appendChild(vocabularyItem);
            });
        });
    };

    // Event listeners
    addWordButton.addEventListener('click', () => {
        const word = newWordInput.value.trim();
        addWord(word);
    });

    newWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const word = newWordInput.value.trim();
            addWord(word);
        }
    });

    groupBySelect.addEventListener('change', displayVocabulary);
    sortBySelect.addEventListener('change', displayVocabulary);

    // Initial display
    displayVocabulary();
}); 