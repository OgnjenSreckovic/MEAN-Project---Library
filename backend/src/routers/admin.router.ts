import { Router } from "express";
import { AdminController } from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.route('/login').post(
    (req, res) => new AdminController().login(req, res)
);

adminRouter.route('/getRentPeriod').get(
    (req, res) => new AdminController().getRentPeriod(req, res)
);

adminRouter.route('/setRentPeriod').post(
    (req, res) => new AdminController().setRentPeriod(req, res)
);

export default adminRouter;