export class RentedBook {
    bookId      : String;
    dateRented  : Date;
    rentPeriod  : Number;
    dateReturned? : Date;

    constructor(data: Object){
        this.bookId     = data["knjigaId"];
        this.dateRented = new Date(data["datumZaduzenja"]);
        this.rentPeriod = data["periodZaduzenja"];
        if (data.hasOwnProperty("datumVracanja")){
            this.dateReturned = new Date(data["datumVracanja"]);
        }
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
    rentedBooks : RentedBook[] = [];
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


    static newUsers(objects : Object[]){
        let users : User[] = [];
        for (let o of objects) {
            users.push(new User(o));
        }
        return users;
    }

    
}

