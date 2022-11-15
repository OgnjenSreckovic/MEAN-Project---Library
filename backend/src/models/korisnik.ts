import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Korisnik = new Schema(
    {
        tip         : String,
        korime      : String,
        lozinka     : String,
        imeprezime  : String,
        adresa      : String,
        telefon     : String,
        email       : String,
        slika       : {
            type: String,
            default: "http://localhost:4000/images/default.png"
        },
        status      : String,
        zaduzene    : {
            type : Array, 
            default : [] 
        },
        istorija : {
            type: Array,
            default: []
        }
    }
)

export default mongoose.model('Korisnik', Korisnik, 'korisnici');