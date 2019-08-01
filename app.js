const express = require("express");
const mysql = require("mysql");

// Create db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  // password : '123456',
  database: "nodemysql"
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected...");
});

const app = express();

// Create db
app.get("/createdb", (req, res) => {
  let sql = "CREATE DATABASE nodemysql";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("DB created");
  });
});

// Create table
app.get("/createpoststable", (req, res) => {
  let sql =
    "CREATE TABLE posts(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY (id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Posts table created...");
  });
});

// Insert post 1
app.get("/addpost2", (req, res) => {
  let post = {
    title: "Post Two",
    body: "This is post number two"
  };
  let sql = "INSERT INTO posts SET ?";
  let query = db.query(sql, post, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Posts 2 added...");
  });
});

// Select posts
app.get("/getposts", (req, res) => {
  let sql = "SELECT * FROM posts";
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// Select one post
app.get("/getpost/:id", (req, res) => {
  let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// Update post
app.get("/updatepost/:id", (req, res) => {
    let newTitle = 'Updated title';
  let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Updated');
  });
});

// Delete post
app.get("/deletepost/:id", (req, res) => {
  let sql = `DELETE FROM posts WHERE id = ${req.params.id}`;
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Deleted');
  });
});


app.listen("3000", () => {
  console.log("Server started on port 3000");
});
