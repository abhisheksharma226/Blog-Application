const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookeParser = require("cookie-parser");

const Blog = require("./models/blog");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");


const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://127.0.0.1:27017/Blogify")
.then((e) => console.log("MongoDB Connected"));

app.set("view engine" , "ejs");
app.set("views" , path.resolve('./views'));

//middleware
app.use(express.urlencoded({ extended : false }));
app.use(cookeParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/" , async(req, res) => {
    const allBlogs = await Blog.find({});
    res.render("home" , {
        user : req.user,
        blogs: allBlogs,
    });
})


app.use("/user" , userRoute);
app.use("/blog" , blogRoute);


app.listen(PORT , () => {
    console.log(`Server started at ${PORT}`);
})