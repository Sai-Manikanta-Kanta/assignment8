const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();
const port = 3000;
// iam making connction to mongodb atlas remote data base
const uri =
'mongodb+srv://kantasaimanikanta:aaykTfqERDe3mlU0@cluster0.1akrvep.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
}).then(() => {
console.log('Connected to MongoDB Atlas');
}).catch((err) => {
console.log(err)
console.error('Error connecting to MongoDB Atlas:', err.message);
});

app.use(express.json());

// Routes specification
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});