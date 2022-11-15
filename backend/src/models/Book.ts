export class Comment {
    username    : String;
    review      : number;
    text        : string;
    date        : Date;

    constructor(data: Object){
        this.username = data["korime"];
        this.review = data["ocena"];
        this.text = data["tekst"];
        this.date = new Date(data["timestamp"]);
    }

    public static getComments(arr: Object[]) : Comment[] {
        let comments : Comment[]  = [];
        for (let o of arr){
            comments.push(new Comment(o));
        }
        return comments;
    }

}

export class Book {
    _id         : string;
    title       : string;
    authors     : string[];
    genres      : string[];
    publisher   : string[];
    year        : number;
    language    : string;
    image       : string = "http://localhost:4000/books/default.png";
    comments    : Comment[]; 
    timesRented : number = 0;
    numOfCopies : number = 1;
    availCopies : number;
    avgReview   : number;

    constructor(data : Object) {
        this._id = data["_id"];
        this.title = data["naziv"];
        this.authors = data["autori"];
        this.genres = data["zanrovi"];
        this.publisher = data['izdavac'];
        this.year = data["godina"];
        this.language = data["jezik"];
        if (data["slika"]) this.image = data["slika"];
        this.comments = Comment.getComments(data["komentari"]);
        this.timesRented = data["putaUzimana"];
        this.numOfCopies = data["brojKopija"];
        this.availCopies = data["brojSlobodnihKopija"];
        this.avgReview = data["prosecnaOcena"];
    }

    public static getBooks(arr: Object[]){
        let books : Book[]  = [];
        for (let o of arr){
            books.push(new Book(o));
        }
        return books;
    }

}


