import { Request, Response } from "express";
import * as fs from 'fs';
import * as path from 'path';
import mongoose from "mongoose";
import { ParsedQs } from "qs";
import { Book } from "../models/Book";
import Knjiga from "../models/knjiga";


export class BookController {
   
    getAllBooks = (req: Request, res: Response) => {
        Knjiga.find(
            {},
            (err, knjige) => {
                if (err) console.log(err)
                else res.json(Book.getBooks(knjige));
            }
        )
    }

    getTop3Books = (req: Request, res: Response) => {
        Knjiga.find({}).sort({ "putaUzimana" : -1 }).limit(3).exec(
            (err, data) => {
                if (err) console.log(err)
                else{
                    let books : Book[] = Book.getBooks(data);
                    res.json(books);
                }
            }
        )
    }

    getBookOfTheDay = (req: Request, res: Response) => {
        Knjiga.count().exec(
            (err, cnt) => {
                if (err) console.log(err)
                else{
                    let today = new Date();
                    let day = Math.floor(today.getTime() / (24*60*60*1000) );
                    let index = day % cnt;
                    Knjiga.findOne().skip(index).exec(
                        (err, book) => {
                            if (err) console.log(err)
                            else{
                                res.json(new Book(book));
                            }                                
                        }
                    )
                }
            }
        )
    }

    private getTitleFilter(titleSearch : string){
        let splitRegex = new RegExp("[ ,\./\\\\]+");
        let words: string[] = titleSearch.split(splitRegex);
        let filter = [];
        for (let w of words){
            if (w !== "") {
                let f = { "naziv" : { $regex : w, $options : 'i' } };
                filter.push(f);
            }
        }
        return filter;
    }

    private getAuthorFilter(authorSearch : string){
        let splitRegex = new RegExp("[ ,\./\\\\]+");
        let words: string[] = authorSearch.split(splitRegex);
        let filter = [];
        for (let w of words){
            if (w !== "") {
                let f = { "autori" : { $regex : w, $options : 'i' } };
                filter.push(f);
            }
        }
        return filter;
    }


    search = (req: Request, res: Response) => {
        let filter: any = {};
        let titleFilter = this.getTitleFilter(req.query.titleFilter.toString());
        let authorFilter = this.getAuthorFilter(req.query.authorFilter.toString());

        if ((titleFilter.length > 0) || (authorFilter.length > 0)){
            filter = { $or : titleFilter.concat(authorFilter) };
        }
        
        Knjiga.find(
            filter,
            (err, books) => {
                if (err) console.log(err);
                else {
                    res.json(Book.getBooks(books));
                }
            }
        )
    }

    getBookById = (req: Request, res: Response) => {
        let bookId = req.params.bookId;
        Knjiga.findById(bookId, (err, book)=>{
            if (err){
                console.log(err);
            }
            else{
                res.json(new Book(book));
            }
        })
    }

    getBooks = (req: Request, res: Response) => {
        let bookIds = req.body.bookIds;
        console.log(bookIds);
        Knjiga.find(
            { _id : { $in : bookIds } }, 
            (err, books)=>{
            if (err){
                console.log(err);
            }
            else{
                res.json(Book.getBooks(books));
            }
        })
    }

    postComment = (req: Request, res: Response) => { 
        console.log(req);
        Knjiga.findOne({ _id : req.body.bookId }).then( book => {
            console.log("before update");
            console.log(book);
            book.komentari.forEach( (k, i) => {
                if(k.korime == req.body.username) book.komentari.splice(i, 1);
            });

            book.komentari.push({
                korime : req.body.username,
                ocena : req.body.review,
                tekst : req.body.text,
                timestamp : req.body.date
            })

            book.markModified('komentari');
            book.save(err => console.log(err));
            console.log("after update");
            console.log(book);
            res.json(new Book(book));
        });
    }

    addBook = (req, res: Response) => { 
        let genres: string[] = [];
        req.body.genres.split(',').forEach(s => genres.push(s.trim()));
        let authors: string[] = [];
        req.body.authors.split(',').forEach(s => authors.push(s.trim()));
        
        let book = new Knjiga({
            naziv : req.body.title,
            autori : authors,
            zanrovi : genres,
            izdavac : req.body.publisher,
            jezik : req.body.language,
            godina : req.body.year,
            brojKopija : req.body.availCopies,
            brojSlobodnihKopija : req.body.availCopies
        });

        

        console.log(book);

        book.save().then(book => {
            res.status(200).json(new Book(book));
        }).catch(err => {
            console.log(err);
            res.status(400).json({
                'message': 'error adding book.'
            })
        });
    }

    setImage = (req, res) => {
        let bookId = req.body.bookId;
        let oldPath : string = req.body.oldImagePath;
        
        if (req.file) {
            const mimeType = req.file.mimetype.split('/');
            const fileType = mimeType[1];
            let filename = req.file.originalname + '.' + fileType;
            
            let oldFilename = oldPath.slice(oldPath.lastIndexOf('/') + 1);
            console.log(`${oldFilename} !== ${filename} : ${oldFilename !== filename}`)
            if (oldFilename !== filename) {

                let update = { slika : `http://localhost:4000/books/${filename}` };
                
                Knjiga.findOneAndUpdate(
                    { _id : bookId },
                    update,
                    { new: true },
                    (err, book) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(new Book(book));
                        }
                });

                if (oldFilename !== "default.png") {
                    fs.unlink(
                        path.join(__dirname, `../../books/${oldFilename}`),
                        (err) => {
                            if (err) console.log(err);
                        }
                    );
                }   

            } else {
                res.json(null);
            }
        } else {
            console.log("Error: file not found");
        }
        
    }


    editBook = (req: Request, res: Response) => {
        let filter = { _id : req.body.bookId };

        console.log("-----------------------new values");
        console.log(req.body);


        Knjiga.findOne(filter).then((book)=>{
            console.log("before changes");
            console.log(book);

            if (book.naziv != req.body.title){
                book.naziv = req.body.title;
                book.markModified("naziv");
            }
            if (book.autori != req.body.authors) {
                book.autori = req.body.authors;
                book.markModified("autori");
            }
            if (book.zanrovi != req.body.genres) {
                book.zanrovi = req.body.genres;
                book.markModified("zanrovi");
            }
            if (book.izdavac != req.body.publisher) {
                book.izdavac = req.body.publisher;
                book.markModified("izdavac");
            }
            if (book.godina != req.body.year) {
                book.godina = req.body.year;
                book.markModified("godina");
            }
            if (book.jezik != req.body.language) {
                book.jezik = req.body.language;
                book.markModified("jezik");
            }
            let dif = (req.body.availCopies as number) - (book.brojSlobodnihKopija as number);
            if (dif != 0){
                book.brojSlobodnihKopija = req.body.availCopies;
                book.brojKopija = (book.brojKopija as number) + dif;
                book.markModified("brojSlobodnihKopija");
                book.markModified("brojKopija");
            }
            console.log("after changes");
            console.log(book);

            book.save(err => console.log(err));
            console.log("after save");
            console.log(book);
            res.json(new Book(book));
            
        })
    }

    delete = (req: Request, res : Response) => {
        Knjiga.deleteOne(
            { _id : req.body.bookId},
            (err, doc)=>{
                console.log(doc);
                if (err) console.log(err);
                else res.json({"message":"deleted"});
            }
        );
    }
}
    