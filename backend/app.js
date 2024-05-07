const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const dotenv = require('dotenv');
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: envFile });
console.log(process.env);
const morgan = require('morgan');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.use('/api/files', fileRoutes);
app.get('/', (req, res) => res.send('Welcome to the File Upload API'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
