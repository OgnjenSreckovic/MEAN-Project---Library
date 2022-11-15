"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = exports.Comment = void 0;
class Comment {
    constructor(data) {
        this.username = data["korime"];
        this.review = data["ocena"];
        this.text = data["tekst"];
        this.date = new Date(data["timestamp"]);
    }
    static getComments(arr) {
        let comments = [];
        for (let o of arr) {
            comments.push(new Comment(o));
        }
        return comments;
    }
}
exports.Comment = Comment;
class Book {
    constructor(data) {
        this.image = "http://localhost:4000/books/default.png";
        this.timesRented = 0;
        this.numOfCopies = 1;
        this._id = data["_id"];
        this.title = data["naziv"];
        this.authors = data["autori"];
        this.genres = data["zanrovi"];
        this.publisher = data['izdavac'];
        this.year = data["godina"];
        this.language = data["jezik"];
        if (data["slika"])
            this.image = data["slika"];
        this.comments = Comment.getComments(data["komentari"]);
        this.timesRented = data["putaUzimana"];
        this.numOfCopies = data["brojKopija"];
        this.availCopies = data["brojSlobodnihKopija"];
        this.avgReview = data["prosecnaOcena"];
    }
    static getBooks(arr) {
        let books = [];
        for (let o of arr) {
            books.push(new Book(o));
        }
        return books;
    }
}
exports.Book = Book;
//# sourceMappingURL=Book.js.map