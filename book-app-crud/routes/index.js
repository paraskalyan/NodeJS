var express = require('express');
const fs = require('fs')
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/books',(req,res)=>{
  fs.readFile('books.json',(err, data)=>{
    if(err) throw err;
    const books = JSON.parse(data);
    res.render('books', {books});
  })
});

router.post('/books',(req,res)=>{
  fs.readFile('books.json',(err, data)=>{
    if(err) throw err;
    const books = JSON.parse(data);

    books.push({
      name: req.body.name,
      author:  req.body.author,
      genre: req.body.genre
    })

    fs.writeFile('books.json', JSON.stringify(books),(err)=>{
      if(err){
        console.log(err);
        return res.status(500).send("Error writing file");
      }
    });
    res.redirect('/books');
  })
});

router.get('/books/add',(req,res)=>{
  res.render('add-book');
});


router.delete('/books/delete/:id',(req,res)=>{
  const id = req.params.id *1;
  console.log(id)
  fs.readFile('books.json',(err, data)=>{
    if(err) throw err;
    const books = JSON.parse(data);

    const bookIndex = books.findIndex((book) => book.id === id);
    console.log(bookIndex)

    if(bookIndex === -1){
      console.log("book not found")
      res.status(500).send("Book not found");
      return;
    }

    books.splice(bookIndex, 1);

    fs.writeFile('books.json', JSON.stringify(books),(err)=>{
      if(err){
        return res.status(500).send("Error while writing");
      }
      res.send(`Book with id ${id} deleted`)
    })

  });

})

router.get('/books/delete',(req,res)=>{
  res.render('delete-book')
})
module.exports = router;
