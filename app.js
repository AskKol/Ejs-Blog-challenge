//jshint esversion:6
const helperFunc = require("./scripts/helperFunctions");
const port = process.env.PORT || "3000";

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const posts = [];
const composeErrorObj = {};

app.get("/", (req, res) => {
  res.render("home", {
    homeStartingContent: helperFunc.homeStartingContent,
    posts: posts,
  });
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent: helperFunc.aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: helperFunc.contactContent });
});

app
  .route("/compose")
  .get((req, res) => {
    res.render("compose", { errors: composeErrorObj });
  })
  .post((req, res) => {
    const errorCount = 0;

    if (helperFunc.isTextNullOrEmpty(req.body.postTitle)) {
      composeErrorObj.postTitle = "Please provide a title";
      errorCount++;
    }

    if (helperFunc.isTextNullOrEmpty(req.body.postTitle)) {
      composeErrorObj.postBody = "Please provide a post";
      errorCount++;
    }

    if (errorCount > 0) {
      res.redirect("/compose");
    }
    const post = {
      title: req.body.postTitle.trim(),
      content: req.body.postBody.trim(),
    };
    posts.push(post);

    res.redirect("/");
  });

app.get("/posts/:postName", (req, res) => {
  const post = helperFunc.getPost(posts, req.params.postName);
  if (post) {
    res.render("post", { post: post });
  } else {
    res.render("error", { errorMessage: `${req.params.postName} not found!` });
  }
});
app.listen(port, function () {
  console.log("Server started on port 3000");
});
