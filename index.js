// code is used for initialization(first step to create the server), no changes in syntax for any backend
/*in terminal (install dependencies, before writing the js code) ->
** make sure the terminal is pointint to the directory where "package.json" is present
npm install sqlite
            sqlite3
            path
            express
*/
const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();

const dbPath = path.join(__dirname,"goodreads.db");

let db = null;

const initializeServiceAndDb = async(req,res)=>{
    try{
        db = await open({
            filename : dbPath,
            driver : sqlite3.Database
        })
        app.listen(3005,()=>{
            console.log("Server started at port 3005")
        })
    }catch (error) {
        console.log(error.message);
        process.exit(1)
    }
}


initializeServiceAndDb(); 
// i did not call the function, and also did not save the code so it was throwing an error
// make sure to be in the same working directory(folder) in the terminal for the ode to work properly.
// to check the working of the code in the terminal using the command "node index.js"
// before running the code, make sure your dependencies are istalled in the package.json file
//----------------------------------------******---------------------------------------------------------------------------------
                    
                    // API "Application Programming Interface"
// we write queries in the backend to get the data and send to the user.

app.get("/books",async(req,res)=>{ // for books
    const getBooksQuery =
    `SELECT * FROM book ORDER BY book_id; 
    `;
   // use of backticks(below esc key on keyboard) 

    const bookArray = await db.all(getBooksQuery);
    res.send(bookArray);
})
// first save the code-> start the server(in terminal,"node index.js")-> goto Thunder Client-> type the request "http://localhost:3005/books"-> then press "SEND" to get the data on the server


app.get("/author",async(req,res)=>{ // for author
    const getAuthorQuery =
    `SELECT * FROM author ORDER BY author_id; 
    `;
   // use of backticks(below esc key on keyboard) 

    const authorArray = await db.all(getAuthorQuery);
    res.send(authorArray);
})
// first save the code-> start the server(in terminal,"node index.js")-> goto Thunder Client-> type the request "http://localhost:3005/author"-> then press "SEND" to get the data on the server

//Post book API
app.post("/books/", async(req,res)=>{
    const bookDetails = req.body;
    const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
    } = bookDetails;
    const addBookQuery = `
        INSERT INTO
        book (title,author_id,rating,rating_count,review_count,description,pages,date_of_publication,edition_language,price,online_stores)
        VALUES
        (
            '${title}',
            ${authorId},
            ${rating},
            ${ratingCount},
            ${reviewCount},
            '${description}',
            ${pages},
            '${dateOfPublication}',
            '${editionLanguage}',
            ${price},
            '${onlineStores}'
        );`;
    const dbResponse = await db.run(addBookQuery);
    res.send("Book Added Successfully");
})

//PUT (UPDATE) book API
app.put("/books/:bookId/", async(req,res)=>{
    const {bookId} = req.params;
    const bookDetails = req.body;
    const {
        title,
        authorId,
        rating,
        ratingCount,
        reviewCount,
        description,
        pages,
        dateOfPublication,
        editionLanguage,
        price,
        onlineStores,
    } = bookDetails;

    const updateBookQuery = `
        UPDATE book
        SET
            title='${title}',
            author_id=${authorId},
            rating=${rating},
            rating_count=${ratingCount},
            review_count=${reviewCount},
            description='${description}',
            pages=${pages},
            date_of_publication='${dateOfPublication}',
            edition_language='${editionLanguage}',
            price= ${price},
            online_stores='${onlineStores}'
        WHERE
            book_id = ${bookId};`;
    const dbResponse = await db.run(updateBookQuery);
    res.send("Book Updated Succesfully");
})

//DELETE books API
app.delete("/books/:bookId/", async(req,res)=>{
    const {bookId} = req.params;
    const deleteBookQuery = `
    DELETE FROM
        book
    WHERE
        book_id = ${bookId};`;
    const dbResponse = await db.run(deleteBookQuery);
    res.send("Books Deleted Successfully");
})

//GET books API
app.get("/books/:bookId/",async(req,res)=>{
    const {bookId} = req.params;
    const getAuthorQuery = 
        `SELECT * FROM book WHERE book_id = ${bookId};`;
    const booksArray = await db.all(getAuthorQuery);
    res.send(booksArray);
})


// Get Author Books API  
app.get("/authors/:authorId/", async (req,res) => {
    const{authorId} = req.params;
    const getAuthorBooksQuery = `
        SELECT * FROM author WHERE author_id = ${authorId};`;
    const authorArray = await db.all(getAuthorBooksQuery);
    res.send(authorArray);
})
