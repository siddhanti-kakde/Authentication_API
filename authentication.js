const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());


const dbPath = path.join(__dirname,"goodreads2.db");

let db = null;

const initializeServerAndDb = async(req,res)=>{
    try {
        db= await open({
            filename:dbPath,
            driver:sqlite3.Database
        })
        app.listen(3005,()=>{
            console.log("server started")
        });
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
}

initializeServerAndDb();

app.post("/register/",async(req,res)=>{
    const {username, name, password, gender, location} = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if(dbUser === undefined) {
        const createUserQuery = `
            INSERT INTO
                user(username, name, password, gender, location)
            VALUES
            (
                '${username}',
                '${name}',
                '${hashedPassword}',
                '${gender}',
                '${location}'
            )`;
        const dbResponse = await db.run(createUserQuery);
        const newUserId = dbResponse.lastID;
        res.send(`Created new user with ${newUserId}`);
    }
    else {
        res.status = 400;
        res.send("User already exists");
    }
});

app.post("/login/",async(req,res)=>{
    const {username, password} = req.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${username}';`;
    const dbUser = await db.get(selectUserQuery);
    if(dbUser === undefined) {
        res.status(400);
        res.send("Invlaid User");
    }
    else {
        const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
        if(isPasswordMatched === true) {
            res.send("Login Success");
        }
        else {
            res.status(400);
            res.send("Invalid Password");
        }
    }
});