const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create table for tracking links
db.serialize(() => {
    db.run(`CREATE TABLE links (
        id TEXT PRIMARY KEY,
        name TEXT,
        destination TEXT,
        created TEXT,
        visits TEXT
    )`);
});

// Track link visits
app.get('/track/:id', async (req, res) => {
    const trackingId = req.params.id;
    const destinationUrl = req.query.redirect;

    // Get visitor's IP address using dynamic import
    const publicIp = (await import('public-ip')).default;
    const ip = await publicIp.v4();

    // Log visit
    db.serialize(() => {
        db.get(`SELECT * FROM links WHERE id = ?`, [trackingId], (err, row) => {
            if (row) {
                const visits = JSON.parse(row.visits || '[]');
                visits.push({ ip, timestamp: new Date().toISOString() });
                db.run(`UPDATE links SET visits = ? WHERE id = ?`, [JSON.stringify(visits), trackingId]);
            }
        });
    });

    // Redirect to the destination URL
    res.redirect(destinationUrl);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
