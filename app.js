const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const filePath = path.join(__dirname, 'notes.json');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Load notes
function loadNotes() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Save notes
function saveNotes(notes) {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

// Home Page
app.get('/', (req, res) => {
    const notes = loadNotes();
    res.render('notes', { notes })
});

// Add Note
app.post('/add', (req, res) => {
    const notes = loadNotes();
    notes.push({
        title: req.body.title,
        content: req.body.content
    });
    saveNotes(notes);   
    res.redirect("/");
});

// Delete Note
app.post('/delete/:index', (req, res) => {
    const notes = loadNotes();
    notes.splice(req.params.index, 1);
    saveNotes(notes);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log('📒 Note Keeper running at http://localhost:3000');
});