import { Request, Response } from "express";
import Administracija from "../models/administracija";

export class AdminController {
    
    login = (req: Request, res: Response) => {
        console.log("admin/login");
        Administracija.findOne({}, (err, doc)=>{
            if (err) console.log(err);
            else {
                console.log(doc);
                if (
                    (doc.adminKorime == req.body.username) &&
                    (doc.adminLozinka == req.body.password)
                ){
                    res.json(1);
                }else{
                    res.json(null);
                }
            }
        })
    }

    getRentPeriod = (req: Request, res: Response) => {
        Administracija.findOne({}, (err, doc)=>{
            if (err) console.log(err);
            else res.json(doc.periodZaduzenja);
        })
    }

    setRentPeriod = (req: Request, res: Response) => {
        Administracija.findOneAndUpdate(
            {}, 
            { $set : { periodZaduzenja : req.body.rentPeriod } },
            {new : true},
            (err, doc)=>{
            if (err) console.log(err);
            else res.json(doc.periodZaduzenja);
        })
    }
}