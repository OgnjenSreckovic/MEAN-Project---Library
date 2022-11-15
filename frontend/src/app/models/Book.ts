export const DEFAULT_BOOK_IMAGE = "http://localhost:4000/books/default.png";

export class Comment {
    username    : string;
    review      : number;
    text        : string;
    date        : Date;

    constructor(copy? : Comment){
        if (copy){
            this.username = copy.username;
            this.review = copy.review;
            this.text = copy.text;
            this.date = new Date(copy.date);
        }
    }
}

export class Knjiga {
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

    constructor(copy?: Knjiga){
        if (copy) {
            this._id = copy._id;
            this.title = copy.title;
            this.authors = copy.authors;
            this.genres = copy.genres;
            this.publisher = copy.publisher;
            this.year = copy.year;
            this.language = copy.language;
            this.image = copy.image;
            this.comments = [];
            this.timesRented = copy.timesRented;
            this.numOfCopies = copy.numOfCopies;
            this.availCopies = copy.availCopies;
            this.avgReview = copy.avgReview;
            
            copy.comments.forEach(c => this.comments.push(new Comment(c)) )
        }
    }
    
}


