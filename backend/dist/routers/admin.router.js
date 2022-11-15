"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const adminRouter = (0, express_1.Router)();
adminRouter.route('/login').post((req, res) => new admin_controller_1.AdminController().login(req, res));
adminRouter.route('/getRentPeriod').get((req, res) => new admin_controller_1.AdminController().getRentPeriod(req, res));
adminRouter.route('/setRentPeriod').post((req, res) => new admin_controller_1.AdminController().setRentPeriod(req, res));
exports.default = adminRouter;
//# sourceMappingURL=admin.router.js.map