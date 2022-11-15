"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_controller_1 = require("../controllers/book.controller");
const storage_books_1 = __importDefault(require("../storage-books"));
const bookRouter = (0, express_1.Router)();
bookRouter.route('/getAllBooks').get((req, res) => new book_controller_1.BookController().getAllBooks(req, res));
bookRouter.route('/getTop3Books').get((req, res) => new book_controller_1.BookController().getTop3Books(req, res));
bookRouter.route('/getBookOfTheDay').get((req, res) => new book_controller_1.BookController().getBookOfTheDay(req, res));
bookRouter.route('/search').get((req, res) => new book_controller_1.BookController().search(req, res));
bookRouter.route('/getBookById/:bookId').get((req, res) => new book_controller_1.BookController().getBookById(req, res));
bookRouter.route('/getBooks').post((req, res) => new book_controller_1.BookController().getBooks(req, res));
bookRouter.route('/postComment').post((req, res) => new book_controller_1.BookController().postComment(req, res));
bookRouter.route('/addBook').post((req, res) => new book_controller_1.BookController().addBook(req, res));
bookRouter.route("/setImage").post(storage_books_1.default, (req, res) => new book_controller_1.BookController().setImage(req, res));
bookRouter.route('/editBook').post((req, res) => new book_controller_1.BookController().editBook(req, res));
bookRouter.route('/delete').post((req, res) => new book_controller_1.BookController().delete(req, res));
exports.default = bookRouter;
//# sourceMappingURL=books.router.js.map