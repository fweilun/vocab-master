# English Vocabulary Learning App

A web application for learning and organizing English vocabulary words. This application helps users track their vocabulary learning progress by allowing them to add new words, automatically translating them to Vietnamese, and organizing them by time periods.

## Features

- Add new vocabulary words with automatic translation to Vietnamese
- Group words by:
  - Day
  - Week
  - Month
- Sort words by:
  - Time (newest first)
  - Alphabetical order (A-Z)
- Persistent storage using localStorage
- Modern and responsive design

## Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

## Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Start the Python backend server:
   ```bash
   python server.py
   ```

3. Open `index.html` in a web browser

## How to Use

1. Enter an English word in the input field
2. Click the "Add Word" button
3. The word will be automatically translated to Vietnamese
4. Use the dropdown menus to:
   - Group words by different time periods
   - Sort words by time or alphabetically

## Technical Details

The application is built using:
- HTML5 for structure
- CSS3 for styling
- JavaScript (ES6+) for functionality
- Python (Flask) for backend translation
- googletrans library for translation
- localStorage for data persistence

## File Structure

- `index.html` - Main HTML file
- `styles.css` - CSS styles
- `script.js` - JavaScript functionality
- `server.py` - Python backend server
- `requirements.txt` - Python dependencies
- `README.md` - This documentation file

## Browser Support

The application works on all modern browsers that support:
- ES6+ JavaScript
- localStorage
- CSS3 Flexbox 