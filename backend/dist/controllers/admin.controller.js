"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const administracija_1 = __importDefault(require("../models/administracija"));
class AdminController {
    constructor() {
        this.login = (req, res) => {
            console.log("admin/login");
            administracija_1.default.findOne({}, (err, doc) => {
                if (err)
                    console.log(err);
                else {
                    console.log(doc);
                    if ((doc.adminKorime == req.body.username) &&
                        (doc.adminLozinka == req.body.password)) {
                        res.json(1);
                    }
                    else {
                        res.json(null);
                    }
                }
            });
        };
        this.getRentPeriod = (req, res) => {
            administracija_1.default.findOne({}, (err, doc) => {
                if (err)
                    console.log(err);
                else
                    res.json(doc.periodZaduzenja);
            });
        };
        this.setRentPeriod = (req, res) => {
            administracija_1.default.findOneAndUpdate({}, { $set: { periodZaduzenja: req.body.rentPeriod } }, { new: true }, (err, doc) => {
                if (err)
                    console.log(err);
                else
                    res.json(doc.periodZaduzenja);
            });
        };
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map