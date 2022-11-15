import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Administracija = new Schema(
    {
        adminKorime         : String,
        adminLozinka        : String,
        periodZaduzenja     : Number,
        produzetakZaduzenja : Number, 
    }
)

export class Admin {
    adminUsername   : string;
    adminPassword   : string;
    rentPeriod      : number;
    rentExtension   : number;

    constructor(data: Object) {
        this.adminUsername   = data["adminKorime"];
        this.adminPassword   = data["adminLozinka"];
        this.rentPeriod      = data["periodZaduzenja"];
        this.rentExtension   = data["produzetakZaduzenja"];
    }
}

export default mongoose.model('Administracija', Administracija, 'administracija');