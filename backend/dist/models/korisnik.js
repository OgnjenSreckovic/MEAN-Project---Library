"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Korisnik = new Schema({
    tip: String,
    korime: String,
    lozinka: String,
    imeprezime: String,
    adresa: String,
    telefon: String,
    email: String,
    slika: {
        type: String,
        default: "http://localhost:4000/images/default.png"
    },
    status: String,
    zaduzene: {
        type: Array,
        default: []
    },
    istorija: {
        type: Array,
        default: []
    }
});
exports.default = mongoose_1.default.model('Korisnik', Korisnik, 'korisnici');
//# sourceMappingURL=korisnik.js.map