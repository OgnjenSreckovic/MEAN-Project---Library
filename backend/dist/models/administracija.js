"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
let Administracija = new Schema({
    adminKorime: String,
    adminLozinka: String,
    periodZaduzenja: Number,
    produzetakZaduzenja: Number,
});
class Admin {
    constructor(data) {
        this.adminUsername = data["adminKorime"];
        this.adminPassword = data["adminLozinka"];
        this.rentPeriod = data["periodZaduzenja"];
        this.rentExtension = data["produzetakZaduzenja"];
    }
}
exports.Admin = Admin;
exports.default = mongoose_1.default.model('Administracija', Administracija, 'administracija');
//# sourceMappingURL=administracija.js.map