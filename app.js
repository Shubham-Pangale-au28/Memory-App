const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts.js');
const userRouter = require("./routes/user.js");

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

app.use('/posts', postRoutes);
app.use("/user", userRouter);

const CONNECTION_URL = 'mongodb+srv://shubham40:Pass%40123@cluster0.wlhsk.mongodb.net/?retryWrites=true&w=majority';
// const CONNECTION_URL = 'mongodb://localhost:27017'
const PORT = process.env.PORT|| 5000;

mongoose
    .connect(CONNECTION_URL)
    .then(() => console.log("Database Connection Successfully!!..."))
    .catch((err) => {
        console.log(err);
    });


app.listen(PORT, () => {
    console.log(`Server Started On Port http://localhost: ${PORT}`);
});