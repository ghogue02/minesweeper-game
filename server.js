const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const LEADERBOARD_FILE = 'leaderboard.json';

// Initialize leaderboard file if it doesn't exist
if (!fs.existsSync(LEADERBOARD_FILE)) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([]));
}

app.get('/api/leaderboard', (req, res) => {
    const leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD_FILE));
    res.json(leaderboard);
});

app.post('/api/score', (req, res) => {
    const { name, score } = req.body;
    if (!name || !score) {
        return res.status(400).json({ error: 'Name and score are required' });
    }

    let leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD_FILE));
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Keep only top 10 scores

    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard));
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
