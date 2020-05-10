const express = require('express');
const connectDB = require('./config/db');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const replyRoutes = require('./routes/reply');

// Express
const app = express();

// Db
connectDB();

// Middlewares
app.use(morgan('dev'));
// TODO - is bodyparser needed?
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// TODO - Is it needed?
// app.use(cookieParser());
app.use(express.json({ extended: false }));
app.use(expressValidator());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes);
app.use('/api', replyRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
