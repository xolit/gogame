require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./models/db');
const userRoutes = require('./Routes/UserRoutes');
const gameInfo = require('./models/infosSchema');

app.use(cors());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));

// Connect to MongoDB
connectDB();
// Import routes
app.use(userRoutes);
// costom routes
app.get('/', async (req, res) => {
    try {
        const games = await gameInfo.find(); // Make sure `Game` is a Mongoose model
        res.render('Home', { data: games }); // Pass an array
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.get('/signup', (req, res) => {
    res.render('signup');
});
app.get('/login', (req, res) => {
    res.render('login');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
});