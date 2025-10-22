const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// CSV file path
const csvFilePath = path.join(__dirname, 'data', 'waitlist.csv');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize CSV file with headers if it doesn't exist
function initializeCSV() {
    if (!fs.existsSync(csvFilePath)) {
        const headers = 'Email,Name,Company,Timestamp\n';
        fs.writeFileSync(csvFilePath, headers);
        console.log('Created waitlist.csv with headers');
    }
}

// Function to escape CSV values
function escapeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    
    const stringValue = String(value);
    
    // If the value contains comma, double quote, or newline, wrap in quotes and escape quotes
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return '"' + stringValue.replace(/"/g, '""') + '"';
    }
    
    return stringValue;
}

// Append to CSV file
function appendToCSV(data) {
    const csvLine = `${escapeCsvValue(data.email)},${escapeCsvValue(data.name)},${escapeCsvValue(data.company)},${escapeCsvValue(data.timestamp)}\n`;
    fs.appendFileSync(csvFilePath, csvLine);
}

// Check if email already exists
function emailExists(email) {
    if (!fs.existsSync(csvFilePath)) {
        return false;
    }
    
    const content = fs.readFileSync(csvFilePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (line) {
            const columns = line.split(',');
            if (columns[0] && columns[0].replace(/"/g, '').toLowerCase() === email.toLowerCase()) {
                return true;
            }
        }
    }
    
    return false;
}

// Initialize CSV on startup
initializeCSV();

// API endpoint to handle waitlist submissions
app.post('/api/waitlist', (req, res) => {
    try {
        const { email, name, company, timestamp } = req.body;
        
        // Validate required fields
        if (!email || !name) {
            return res.status(400).json({ 
                error: 'Email and name are required' 
            });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }
        
        // Check if email already exists
        if (emailExists(email)) {
            return res.status(409).json({ 
                error: 'Email already registered' 
            });
        }
        
        // Prepare data
        const waitlistData = {
            email: email.trim(),
            name: name.trim(),
            company: company ? company.trim() : '',
            timestamp: timestamp || new Date().toISOString()
        };
        
        // Append to CSV
        appendToCSV(waitlistData);
        
        console.log(`New waitlist signup: ${waitlistData.email} - ${waitlistData.name}`);
        
        res.status(200).json({ 
            message: 'Successfully joined waitlist',
            data: waitlistData
        });
        
    } catch (error) {
        console.error('Error processing waitlist signup:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// API endpoint to get waitlist count (optional - for admin purposes)
app.get('/api/waitlist/count', (req, res) => {
    try {
        if (!fs.existsSync(csvFilePath)) {
            return res.json({ count: 0 });
        }
        
        const content = fs.readFileSync(csvFilePath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        const count = Math.max(0, lines.length - 1); // Subtract 1 for header
        
        res.json({ count });
    } catch (error) {
        console.error('Error getting waitlist count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Waitlist server running on http://localhost:${PORT}`);
    console.log(`CSV file location: ${csvFilePath}`);
});

module.exports = app;