import { Request, Response } from "express";
import { RentedBook, User } from "../models/User";
import Korisnik from "../models/korisnik";
import * as fs from 'fs';
import * as path from 'path';
import Administracija from "../models/administracija";
import { Book } from "../models/Book";
import Knjiga from "../models/knjiga";

export class UserController {
    
    registerCheck = (req: Request, res: Response) => {
        Korisnik.find(
            { 
                $and : [
                    { 
                        "status" : { $in : ["kreiran", "prihvacen"] } 
                    },
                    {
                        $or : [
                            { "email" :  req.body.email },
                            { "korime" :  req.body.username }
                        ]
                    }
                ]
            }
        ).then((users: Object[]) => {
            if (users.length > 0){
                if (users[0]['korime'] == req.body.username){
                    res.json({
                        "status"  : 1,
                        "message" : "username-taken"
                    });
                    return;
                }
                if (users[0]['email'] == req.body.email){
                    res.json({
                        "status"  : 2,
                        "message" : "email-taken"
                    });
                    return;
                }            
            }else{
                res.json({
                    "status"  : 0,
                    "message" : "ok"
                });    
            }
        });
    }


    register = (req, res: Response) => {
        let filename = "default.png";
        if (req.file) {
            const mimeType = req.file.mimetype.split('/');
            const fileType = mimeType[1];
            filename = req.file.originalname + '.' + fileType;
        }

        let user = new Korisnik({
            tip         : req.body.type,
            korime      : req.body.username,
            lozinka     : req.body.password,
            imeprezime  : req.body.fullName,
            adresa      : req.body.address,
            telefon     : req.body.phone,
            email       : req.body.email,
            slika       : `http://localhost:4000/images/${filename}`,
            status      : 'kreiran',
            zaduzene    : []
        });

        // let user = new User(req.body);

        user.save().then(user => {
            res.status(200).json(user)
        }).catch(err => {
            res.status(400).json({
                'message': 'error adding user.'
            })
        });
    }

    login = (req: Request, res: Response) => {
        let username = req.body.username;
        let password = req.body.password;

        Korisnik.findOne(
            {
                'korime': username, 
                'lozinka': password
            },
            (err, user)=>{
                
                if (err) console.log(err);
                else {
                        if (user){
                        console.log(user);
                        res.json(new User(user));
                    }else {
                        res.json(user);
                    }
                }
            }
        )
    };

    changePassword = (req: Request, res: Response) => {
        let username = req.body.username;
        let oldP = req.body.oldPassword;
        let newP = req.body.newPassword;

        Korisnik.findOneAndUpdate(
            { 
                "korime" : username,
                "lozinka" : oldP
            },
            {
                $set : { "lozinka" : newP }
            },
            { new: true },
            (err, user) => {
                console.log(user);

                if (err) console.log(err);
                else res.json(user)
            }
        )
    }


    infoChangeCheck = (req: Request, res: Response) => {
      
        Korisnik.find(
            { 
                $and : [
                    {
                        "korime" : { $ne : req.body.username }
                    },
                    { 
                        "status" : { $in : ["kreiran", "prihvacen"] } 
                    },
                    {
                        $or : [
                            { "email" :  req.body.newEmail },
                            { "korime" :  req.body.newUsername }
                        ]
                    }
                ]
            }
        ).then((users: Object[]) => {
            if (users.length > 0){
                if (users[0]['korime'] == req.body.newUsername){
                    res.json({
                        "status"  : 1,
                        "message" : "username-taken"
                    });
                    return;
                }
                if (users[0]['email'] == req.body.newEmail){
                    res.json({
                        "status"  : 2,
                        "message" : "email-taken"
                    });
                    return;
                }            
            }else{
                res.json({
                    "status"  : 0,
                    "message" : "ok"
                });    
            }
        });
    }


    changeInfo = (req : Request, res: Response) => {
        let filter = { "korime" : req.body.oldUsername };
        let update : Object;

        if (
            (req.body.oldUsername != req.body.username)
             && 
            (!req.body.imageUrl.endsWith("default.png"))
        ) {
            let ext = req.body.imageUrl.slice(
                req.body.imageUrl.lastIndexOf('.')
            );

            let oldImagePath = path.join(__dirname, `../../images/${req.body.oldUsername}${ext}`);
            let newImagePath = path.join(__dirname,`../../images/${req.body.username}${ext}`);
            let newImageUrl = req.body.imageUrl.replace(req.body.oldUsername, req.body.username);
            
            fs.renameSync(oldImagePath, newImagePath);

            update = { 
                $set : {
                    'korime' : req.body.username,
                    'imeprezime' : req.body.fullName,
                    'adresa' : req.body.address,
                    'telefon' : req.body.phone,
                    'email' : req.body.email,
                    'slika' : newImageUrl 
                } 
            };
        }else {
            update = { 
                $set : {
                    'korime' : req.body.username,
                    'imeprezime' : req.body.fullName,
                    'adresa' : req.body.address,
                    'telefon' : req.body.phone,
                    'email' : req.body.email
                } 
            };
        }


        Korisnik.findOneAndUpdate(
            filter,
            update,
            { new: true },
            (err, user) => {
                if (err) console.log(err);
                else res.json(new User(user));
            }
        )
    }

    changeProfilePicture = (req, res: Response) => {
        let username = req.body.username;
        let oldPath : string = req.body.oldImagePath;
        
        if (req.file) {
            const mimeType = req.file.mimetype.split('/');
            const fileType = mimeType[1];
            let filename = req.file.originalname + '.' + fileType;
            
            let oldFilename = oldPath.slice(oldPath.lastIndexOf('/') + 1);
            console.log(`${oldFilename} !== ${filename} : ${oldFilename !== filename}`)
            if (oldFilename !== filename) {

                let update = { slika : `http://localhost:4000/images/${filename}` };
                
                Korisnik.findOneAndUpdate(
                    { korime : username },
                    update,
                    { new: true },
                    (err, user) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.json(new User(user));
                        }
                });

                if (oldFilename !== "default.png") {
                    fs.unlink(
                        path.join(__dirname, `../../images/${oldFilename}`),
                        (err) => {
                            if (err) console.log(err);
                        }
                    );
                }   

            } else {
                res.json(null);
            }
        } else {
            console.log("Error: file not found");
        }
        
    }

    rentBook = (req, res: Response) => {
        Administracija.findOne({}, { periodZaduzenja : 1 }, (err, info) => {
            if (err) console.log(err);
            else {
                let rentedBook = {
                    knjigaId        : req.body.bookId,
                    datumZaduzenja  : req.body.dateRented,
                    periodZaduzenja : info["periodZaduzenja"]
                }

                Korisnik.findOneAndUpdate(
                    { korime : req.body.username },
                    { $push :  { zaduzene : rentedBook }},
                    { new : true },
                    (err, user) => {
                        if (err) console.log(err);
                        else if (user){
                           
                        
                            Knjiga.findOneAndUpdate(
                                { _id : req.body.bookId },
                                { $inc : { putaUzimana : 1, brojSlobodnihKopija : -1 } },
                                { new : true },
                                (err, book) => {
                                    if (err) console.log(err);
                                    else 
                                        if (book) res.json({ user : new User(user), book : new Book(book) });
                                        else res.json(null);
                                }
                            )
                        } else res.json(null);                            
                    } 
                )
            }
        })
    }


    getUser = (req: Request, res : Response) => {
        let username = req.query.username;
        Korisnik.findOne(
            { korime : username },
            (err, user) => {
                if (err) console.log(err);
                else if (user) res.json(new User(user));
                else res.json(null);
            }
        )
    }

    returnBook = (req: Request, res : Response) => {
        let historyEntry = {
            knjigaId : req.body.rentInfo.bookId,
            datumZaduzenja : req.body.rentInfo.dateRented,
            periodZaduzenja : req.body.rentInfo.rentPeriod,
            datumVracanja : req.body.rentInfo.dateReturned
        }

        console.log(historyEntry);

        Korisnik.findOneAndUpdate(
            { korime : req.body.username },
            { 
                $pull: { zaduzene : { knjigaId : historyEntry.knjigaId } },
                $push: { istorija : historyEntry }
            },
            { new : true },
            (err, doc) => {
                if (err) console.log(err);
                else if (doc) {
                    console.log(doc);
                    let user = new User(doc);
                    Knjiga.updateOne(
                        { _id : historyEntry.knjigaId },
                        { $inc : { brojSlobodnihKopija : 1 } },
                        (err, result) => {
                            if (err) console.log(err);
                            else console.log(result);
                            res.json(user);
                        }
                    )                        
                } else res.json(null);
            }
        )
    }


    getAllUsers = (req: Request, res : Response) => {
        Korisnik.find({}, (err, users)=>{
            if (err) console.log(err);
            else res.json(User.newUsers(users));
        })
    }

    delete = (req: Request, res : Response) => {
        Korisnik.deleteOne(
            { korime : req.body.username},
            (err, doc)=>{
                console.log(doc);
                if (err) console.log(err);
                else res.json({"message":"deleted"});
            }
        );
    }

    setStatus = (req: Request, res: Response) => {
        let username = req.body.username;
        let status = req.body.status;

        Korisnik.updateOne(
            { 
                korime : username
            },
            {
                $set : { status : status }
            },
            (err, doc) => {
                if (err) console.log(err);
                else res.json();
            }
        )
    }
    
}
    