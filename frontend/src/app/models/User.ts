export class RentedBook {
    bookId      : string;
    dateRented  : Date;
    rentPeriod  : number; 
    dateReturned? : Date;

    constructor(data: Object){
        this.bookId = data["idKnjige"];
        this.dateRented = new Date(data["datumZaduzenja"]);
        this.rentPeriod = data["brojDana"];
        if (data.hasOwnProperty("istorija")){
            this.dateReturned = new Date(data["istorija"]);
        }
    }

    static fromJSON(json : Object) : RentedBook {
        let rb : RentedBook = json as RentedBook;
        rb.dateRented = new Date(rb.dateRented);
        if (json.hasOwnProperty("dateReturned")){
            rb.dateRented = new Date(rb.dateReturned);
        }
        return rb;
    }
    
    public isOverdue() {
        let today = new Date();
        today.setHours(0, 0, 0, 0);

        let deadline = new Date(this.dateRented.setHours(0, 0, 0, 0));
        deadline.setDate(deadline.getDate() + this.rentPeriod);

        return (today > deadline);        
    }
}




export class User {
    type: string;
    username: string;
    password: string;
    fullName : string;
    address : string;
    phone : string;
    email : string;
    imagePath : string; 
    status : string;
    rentedBooks: RentedBook[] = [];
    rentHistory: RentedBook[] = [];
    
    constructor(data : Object) {
        this.type = data["tip"];
        this.username = data["korime"];
        this.password = data["lozinka"];
        this.fullName = data["imeprezime"];
        this.address = data["adresa"];
        this.phone = data["telefon"];
        this.email = data["email"];
        this.imagePath = data["slika"];
        this.status = data["status"];
        this.rentedBooks = [];
        this.rentHistory = [];

        for (let rb of data["zaduzene"]){
            this.rentedBooks.push(new RentedBook(rb));
        }

        for (let rh of data["istorija"]){
            this.rentHistory.push(new RentedBook(rh));
        }
    }


    static fromString(jsonString : string) : User {
        let jsonObj : Object = JSON.parse(jsonString);
        return this.fromJSON(jsonObj);
    }

    static fromJSON(jsonObj : Object) : User {
        let user : User = jsonObj as User;
        let rbs = Array.from(user.rentedBooks);
        let rbh = Array.from(user.rentHistory);

        user.rentedBooks = [];
        user.rentHistory = [];

        for (let rb of rbs){
            user.rentedBooks.push(RentedBook.fromJSON(rb));
        }

        for (let rb of rbh) {
            user.rentHistory.push(RentedBook.fromJSON(rb))
        }

        return user;
    }
}