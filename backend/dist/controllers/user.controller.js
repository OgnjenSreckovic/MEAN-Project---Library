"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const korisnik_1 = __importDefault(require("../models/korisnik"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const administracija_1 = __importDefault(require("../models/administracija"));
const Book_1 = require("../models/Book");
const knjiga_1 = __importDefault(require("../models/knjiga"));
class UserController {
    constructor() {
        this.registerCheck = (req, res) => {
            korisnik_1.default.find({
                $and: [
                    {
                        "status": { $in: ["kreiran", "prihvacen"] }
                    },
                    {
                        $or: [
                            { "email": req.body.email },
                            { "korime": req.body.username }
                        ]
                    }
                ]
            }).then((users) => {
                if (users.length > 0) {
                    if (users[0]['korime'] == req.body.username) {
                        res.json({
                            "status": 1,
                            "message": "username-taken"
                        });
                        return;
                    }
                    if (users[0]['email'] == req.body.email) {
                        res.json({
                            "status": 2,
                            "message": "email-taken"
                        });
                        return;
                    }
                }
                else {
                    res.json({
                        "status": 0,
                        "message": "ok"
                    });
                }
            });
        };
        this.register = (req, res) => {
            let filename = "default.png";
            if (req.file) {
                const mimeType = req.file.mimetype.split('/');
                const fileType = mimeType[1];
                filename = req.file.originalname + '.' + fileType;
            }
            let user = new korisnik_1.default({
                tip: req.body.type,
                korime: req.body.username,
                lozinka: req.body.password,
                imeprezime: req.body.fullName,
                adresa: req.body.address,
                telefon: req.body.phone,
                email: req.body.email,
                slika: `http://localhost:4000/images/${filename}`,
                status: 'kreiran',
                zaduzene: []
            });
            // let user = new User(req.body);
            user.save().then(user => {
                res.status(200).json(user);
            }).catch(err => {
                res.status(400).json({
                    'message': 'error adding user.'
                });
            });
        };
        this.login = (req, res) => {
            let username = req.body.username;
            let password = req.body.password;
            korisnik_1.default.findOne({
                'korime': username,
                'lozinka': password
            }, (err, user) => {
                if (err)
                    console.log(err);
                else {
                    if (user) {
                        console.log(user);
                        res.json(new User_1.User(user));
                    }
                    else {
                        res.json(user);
                    }
                }
            });
        };
        this.changePassword = (req, res) => {
            let username = req.body.username;
            let oldP = req.body.oldPassword;
            let newP = req.body.newPassword;
            korisnik_1.default.findOneAndUpdate({
                "korime": username,
                "lozinka": oldP
            }, {
                $set: { "lozinka": newP }
            }, { new: true }, (err, user) => {
                console.log(user);
                if (err)
                    console.log(err);
                else
                    res.json(user);
            });
        };
        this.infoChangeCheck = (req, res) => {
            korisnik_1.default.find({
                $and: [
                    {
                        "korime": { $ne: req.body.username }
                    },
                    {
                        "status": { $in: ["kreiran", "prihvacen"] }
                    },
                    {
                        $or: [
                            { "email": req.body.newEmail },
                            { "korime": req.body.newUsername }
                        ]
                    }
                ]
            }).then((users) => {
                if (users.length > 0) {
                    if (users[0]['korime'] == req.body.newUsername) {
                        res.json({
                            "status": 1,
                            "message": "username-taken"
                        });
                        return;
                    }
                    if (users[0]['email'] == req.body.newEmail) {
                        res.json({
                            "status": 2,
                            "message": "email-taken"
                        });
                        return;
                    }
                }
                else {
                    res.json({
                        "status": 0,
                        "message": "ok"
                    });
                }
            });
        };
        this.changeInfo = (req, res) => {
            let filter = { "korime": req.body.oldUsername };
            let update;
            if ((req.body.oldUsername != req.body.username)
                &&
                    (!req.body.imageUrl.endsWith("default.png"))) {
                let ext = req.body.imageUrl.slice(req.body.imageUrl.lastIndexOf('.'));
                let oldImagePath = path.join(__dirname, `../../images/${req.body.oldUsername}${ext}`);
                let newImagePath = path.join(__dirname, `../../images/${req.body.username}${ext}`);
                let newImageUrl = req.body.imageUrl.replace(req.body.oldUsername, req.body.username);
                fs.renameSync(oldImagePath, newImagePath);
                update = {
                    $set: {
                        'korime': req.body.username,
                        'imeprezime': req.body.fullName,
                        'adresa': req.body.address,
                        'telefon': req.body.phone,
                        'email': req.body.email,
                        'slika': newImageUrl
                    }
                };
            }
            else {
                update = {
                    $set: {
                        'korime': req.body.username,
                        'imeprezime': req.body.fullName,
                        'adresa': req.body.address,
                        'telefon': req.body.phone,
                        'email': req.body.email
                    }
                };
            }
            korisnik_1.default.findOneAndUpdate(filter, update, { new: true }, (err, user) => {
                if (err)
                    console.log(err);
                else
                    res.json(new User_1.User(user));
            });
        };
        this.changeProfilePicture = (req, res) => {
            let username = req.body.username;
            let oldPath = req.body.oldImagePath;
            if (req.file) {
                const mimeType = req.file.mimetype.split('/');
                const fileType = mimeType[1];
                let filename = req.file.originalname + '.' + fileType;
                let oldFilename = oldPath.slice(oldPath.lastIndexOf('/') + 1);
                console.log(`${oldFilename} !== ${filename} : ${oldFilename !== filename}`);
                if (oldFilename !== filename) {
                    let update = { slika: `http://localhost:4000/images/${filename}` };
                    korisnik_1.default.findOneAndUpdate({ korime: username }, update, { new: true }, (err, user) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.json(new User_1.User(user));
                        }
                    });
                    if (oldFilename !== "default.png") {
                        fs.unlink(path.join(__dirname, `../../images/${oldFilename}`), (err) => {
                            if (err)
                                console.log(err);
                        });
                    }
                }
                else {
                    res.json(null);
                }
            }
            else {
                console.log("Error: file not found");
            }
        };
        this.rentBook = (req, res) => {
            administracija_1.default.findOne({}, { periodZaduzenja: 1 }, (err, info) => {
                if (err)
                    console.log(err);
                else {
                    let rentedBook = {
                        knjigaId: req.body.bookId,
                        datumZaduzenja: req.body.dateRented,
                        periodZaduzenja: info["periodZaduzenja"]
                    };
                    korisnik_1.default.findOneAndUpdate({ korime: req.body.username }, { $push: { zaduzene: rentedBook } }, { new: true }, (err, user) => {
                        if (err)
                            console.log(err);
                        else if (user) {
                            knjiga_1.default.findOneAndUpdate({ _id: req.body.bookId }, { $inc: { putaUzimana: 1, brojSlobodnihKopija: -1 } }, { new: true }, (err, book) => {
                                if (err)
                                    console.log(err);
                                else if (book)
                                    res.json({ user: new User_1.User(user), book: new Book_1.Book(book) });
                                else
                                    res.json(null);
                            });
                        }
                        else
                            res.json(null);
                    });
                }
            });
        };
        this.getUser = (req, res) => {
            let username = req.query.username;
            korisnik_1.default.findOne({ korime: username }, (err, user) => {
                if (err)
                    console.log(err);
                else if (user)
                    res.json(new User_1.User(user));
                else
                    res.json(null);
            });
        };
        this.returnBook = (req, res) => {
            let historyEntry = {
                knjigaId: req.body.rentInfo.bookId,
                datumZaduzenja: req.body.rentInfo.dateRented,
                periodZaduzenja: req.body.rentInfo.rentPeriod,
                datumVracanja: req.body.rentInfo.dateReturned
            };
            console.log(historyEntry);
            korisnik_1.default.findOneAndUpdate({ korime: req.body.username }, {
                $pull: { zaduzene: { knjigaId: historyEntry.knjigaId } },
                $push: { istorija: historyEntry }
            }, { new: true }, (err, doc) => {
                if (err)
                    console.log(err);
                else if (doc) {
                    console.log(doc);
                    let user = new User_1.User(doc);
                    knjiga_1.default.updateOne({ _id: historyEntry.knjigaId }, { $inc: { brojSlobodnihKopija: 1 } }, (err, result) => {
                        if (err)
                            console.log(err);
                        else
                            console.log(result);
                        res.json(user);
                    });
                }
                else
                    res.json(null);
            });
        };
        this.getAllUsers = (req, res) => {
            korisnik_1.default.find({}, (err, users) => {
                if (err)
                    console.log(err);
                else
                    res.json(User_1.User.newUsers(users));
            });
        };
        this.delete = (req, res) => {
            korisnik_1.default.deleteOne({ korime: req.body.username }, (err, doc) => {
                console.log(doc);
                if (err)
                    console.log(err);
                else
                    res.json({ "message": "deleted" });
            });
        };
        this.setStatus = (req, res) => {
            let username = req.body.username;
            let status = req.body.status;
            korisnik_1.default.updateOne({
                korime: username
            }, {
                $set: { status: status }
            }, (err, doc) => {
                if (err)
                    console.log(err);
                else
                    res.json();
            });
        };
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map