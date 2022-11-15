import express, { Request, Router } from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import userRouter from './routers/korisnici.router';
import path from 'path';
import bookRouter from './routers/books.router';
import adminRouter from './routers/admin.router';

const app = express();
app.use(cors());
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/biblioteka');
const connection = mongoose.connection;
connection.once(
    'open', 
    ()=>{
        console.log('db connection open');
    }
)


const router = Router();
router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/admin', adminRouter);
app.use('/images', express.static(path.join('images')));
app.use('/books', express.static(path.join('books')));


app.use('/', router);



app.listen(4000, () => console.log(`Express server running on port 4000`));