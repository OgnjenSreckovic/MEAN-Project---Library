"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Book_1 = require("../models/Book");
const knjiga_1 = __importDefault(require("../models/knjiga"));
class BookController {
    constructor() {
        this.getAllBooks = (req, res) => {
            knjiga_1.default.find({}, (err, knjige) => {
                if (err)
                    console.log(err);
                else
                    res.json(Book_1.Book.getBooks(knjige));
            });
        };
        this.getTop3Books = (req, res) => {
            knjiga_1.default.find({}).sort({ "putaUzimana": -1 }).limit(3).exec((err, data) => {
                if (err)
                    console.log(err);
                else {
                    let books = Book_1.Book.getBooks(data);
                    res.json(books);
                }
            });
        };
        this.getBookOfTheDay = (req, res) => {
            knjiga_1.default.count().exec((err, cnt) => {
                if (err)
                    console.log(err);
                else {
                    let today = new Date();
                    let day = Math.floor(today.getTime() / (24 * 60 * 60 * 1000));
                    let index = day % cnt;
                    knjiga_1.default.findOne().skip(index).exec((err, book) => {
                        if (err)
                            console.log(err);
                        else {
                            res.json(new Book_1.Book(book));
                        }
                    });
                }
            });
        };
        this.search = (req, res) => {
            let filter = {};
            let titleFilter = this.getTitleFilter(req.query.titleFilter.toString());
            let authorFilter = this.getAuthorFilter(req.query.authorFilter.toString());
            if ((titleFilter.length > 0) || (authorFilter.length > 0)) {
                filter = { $or: titleFilter.concat(authorFilter) };
            }
            knjiga_1.default.find(filter, (err, books) => {
                if (err)
                    console.log(err);
                else {
                    res.json(Book_1.Book.getBooks(books));
                }
            });
        };
        this.getBookById = (req, res) => {
            let bookId = req.params.bookId;
            knjiga_1.default.findById(bookId, (err, book) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json(new Book_1.Book(book));
                }
            });
        };
        this.getBooks = (req, res) => {
            let bookIds = req.body.bookIds;
            console.log(bookIds);
            knjiga_1.default.find({ _id: { $in: bookIds } }, (err, books) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.json(Book_1.Book.getBooks(books));
                }
            });
        };
        this.postComment = (req, res) => {
            console.log(req);
            knjiga_1.default.findOne({ _id: req.body.bookId }).then(book => {
                console.log("before update");
                console.log(book);
                book.komentari.forEach((k, i) => {
                    if (k.korime == req.body.username)
                        book.komentari.splice(i, 1);
                });
                book.komentari.push({
                    korime: req.body.username,
                    ocena: req.body.review,
                    tekst: req.body.text,
                    timestamp: req.body.date
                });
                book.markModified('komentari');
                book.save(err => console.log(err));
                console.log("after update");
                console.log(book);
                res.json(new Book_1.Book(book));
            });
        };
        this.addBook = (req, res) => {
            let genres = [];
            req.body.genres.split(',').forEach(s => genres.push(s.trim()));
            let authors = [];
            req.body.authors.split(',').forEach(s => authors.push(s.trim()));
            let book = new knjiga_1.default({
                naziv: req.body.title,
                autori: authors,
                zanrovi: genres,
                izdavac: req.body.publisher,
                jezik: req.body.language,
                godina: req.body.year,
                brojKopija: req.body.availCopies,
                brojSlobodnihKopija: req.body.availCopies
            });
            console.log(book);
            book.save().then(book => {
                res.status(200).json(new Book_1.Book(book));
            }).catch(err => {
                console.log(err);
                res.status(400).json({
                    'message': 'error adding book.'
                });
            });
        };
        this.setImage = (req, res) => {
            let bookId = req.body.bookId;
            let oldPath = req.body.oldImagePath;
            if (req.file) {
                const mimeType = req.file.mimetype.split('/');
                const fileType = mimeType[1];
                let filename = req.file.originalname + '.' + fileType;
                let oldFilename = oldPath.slice(oldPath.lastIndexOf('/') + 1);
                console.log(`${oldFilename} !== ${filename} : ${oldFilename !== filename}`);
                if (oldFilename !== filename) {
                    let update = { slika: `http://localhost:4000/books/${filename}` };
                    knjiga_1.default.findOneAndUpdate({ _id: bookId }, update, { new: true }, (err, book) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json(new Book_1.Book(book));
                        }
                    });
                    if (oldFilename !== "default.png") {
                        fs.unlink(path.join(__dirname, `../../books/${oldFilename}`), (err) => {
                            if (err)
                                console.log(err);
                        });
                    }
                }
                else {
                    res.json(null);
                }
            }
            else {
                console.log("Error: file not found");
            }
        };
        this.editBook = (req, res) => {
            let filter = { _id: req.body.bookId };
            console.log("-----------------------new values");
            console.log(req.body);
            knjiga_1.default.findOne(filter).then((book) => {
                console.log("before changes");
                console.log(book);
                if (book.naziv != req.body.title) {
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
                let dif = req.body.availCopies - book.brojSlobodnihKopija;
                if (dif != 0) {
                    book.brojSlobodnihKopija = req.body.availCopies;
                    book.brojKopija = book.brojKopija + dif;
                    book.markModified("brojSlobodnihKopija");
                    book.markModified("brojKopija");
                }
                console.log("after changes");
                console.log(book);
                book.save(err => console.log(err));
                console.log("after save");
                console.log(book);
                res.json(new Book_1.Book(book));
            });
        };
        this.delete = (req, res) => {
            knjiga_1.default.deleteOne({ _id: req.body.bookId }, (err, doc) => {
                console.log(doc);
                if (err)
                    console.log(err);
                else
                    res.json({ "message": "deleted" });
            });
        };
    }
    getTitleFilter(titleSearch) {
        let splitRegex = new RegExp("[ ,\./\\\\]+");
        let words = titleSearch.split(splitRegex);
        let filter = [];
        for (let w of words) {
            if (w !== "") {
                let f = { "naziv": { $regex: w, $options: 'i' } };
                filter.push(f);
            }
        }
        return filter;
    }
    getAuthorFilter(authorSearch) {
        let splitRegex = new RegExp("[ ,\./\\\\]+");
        let words = authorSearch.split(splitRegex);
        let filter = [];
        for (let w of words) {
            if (w !== "") {
                let f = { "autori": { $regex: w, $options: 'i' } };
                filter.push(f);
            }
        }
        return filter;
    }
}
exports.BookController = BookController;
//# sourceMappingURL=book.controller.js.map