"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Knjiga = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        auto: true
    },
    naziv: String,
    autori: [String],
    zanrovi: [String],
    izdavac: [String],
    godina: Number,
    jezik: String,
    slika: {
        type: String,
        default: "http://localhost:4000/books/default.png"
    },
    komentari: {
        type: Array,
        default: []
    },
    putaUzimana: {
        type: Number,
        default: 0
    },
    brojKopija: {
        type: Number,
        default: 1
    },
    brojSlobodnihKopija: Number,
    prosecnaOcena: Number
});
exports.default = mongoose_1.default.model('Knjiga', Knjiga, 'knjige');
//# sourceMappingURL=knjiga.js.map