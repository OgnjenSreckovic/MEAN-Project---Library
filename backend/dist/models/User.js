"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.RentedBook = void 0;
class RentedBook {
    constructor(data) {
        this.bookId = data["knjigaId"];
        this.dateRented = new Date(data["datumZaduzenja"]);
        this.rentPeriod = data["periodZaduzenja"];
        if (data.hasOwnProperty("datumVracanja")) {
            this.dateReturned = new Date(data["datumVracanja"]);
        }
    }
}
exports.RentedBook = RentedBook;
class User {
    constructor(data) {
        this.rentedBooks = [];
        this.rentHistory = [];
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
        for (let rb of data["zaduzene"]) {
            this.rentedBooks.push(new RentedBook(rb));
        }
        for (let rh of data["istorija"]) {
            this.rentHistory.push(new RentedBook(rh));
        }
    }
    static newUsers(objects) {
        let users = [];
        for (let o of objects) {
            users.push(new User(o));
        }
        return users;
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map