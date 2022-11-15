import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import storageBooks from "../storage-books";

const bookRouter = Router();


bookRouter.route('/getAllBooks').get(
    (req, res) => new BookController().getAllBooks(req, res)
);

bookRouter.route('/getTop3Books').get(
    (req, res) => new BookController().getTop3Books(req, res)
);

bookRouter.route('/getBookOfTheDay').get(
    (req, res) => new BookController().getBookOfTheDay(req, res)
)

bookRouter.route('/search').get(
    (req, res) => new BookController().search(req, res)
)

bookRouter.route('/getBookById/:bookId').get(
    (req, res) => new BookController().getBookById(req, res)
)

bookRouter.route('/getBooks').post(
    (req, res) => new BookController().getBooks(req, res)
)

bookRouter.route('/postComment').post(
    (req, res) => new BookController().postComment(req, res)
)

bookRouter.route('/addBook').post(
    (req, res) => new BookController().addBook(req, res)
)

bookRouter.route("/setImage").post(
    storageBooks,
    (req, res) => new BookController().setImage(req, res)
)

bookRouter.route('/editBook').post(
    (req, res) => new BookController().editBook(req, res)
)

bookRouter.route('/delete').post(
    (req, res) => new BookController().delete(req, res)
)


export default bookRouter;