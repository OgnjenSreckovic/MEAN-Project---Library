import mongoose from "mongoose";

const Schema = mongoose.Schema;

let Knjiga = new Schema(
    {
        _id         : {
            type: Schema.Types.ObjectId,
            auto: true
        },
        naziv       : String,
        autori      : [String],
        zanrovi     : [String],
        izdavac     : [String],
        godina      : Number,
        jezik       : String,
        slika       : {
            type: String,
            default: "http://localhost:4000/books/default.png"
        },
        komentari   : {
            type : Array, 
            default : [] 
        },
        putaUzimana : {
            type: Number,
            default : 0
        },
        brojKopija : {
            type: Number,
            default: 1
        },
        brojSlobodnihKopija : Number,
        prosecnaOcena : Number
    }
)

export default mongoose.model('Knjiga', Knjiga, 'knjige');