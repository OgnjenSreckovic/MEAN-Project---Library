"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storage_1 = __importDefault(require("../storage"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.route('/register').post(storage_1.default, (req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/registerCheck').post((req, res) => new user_controller_1.UserController().registerCheck(req, res));
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/changePassword').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/infoChangeCheck').post((req, res) => new user_controller_1.UserController().infoChangeCheck(req, res));
userRouter.route('/changeInfo').post((req, res) => new user_controller_1.UserController().changeInfo(req, res));
userRouter.route('/changeProfilePicture').post(storage_1.default, (req, res) => new user_controller_1.UserController().changeProfilePicture(req, res));
userRouter.route('/rentBook').post((req, res) => new user_controller_1.UserController().rentBook(req, res));
userRouter.route('/getUser').get((req, res) => new user_controller_1.UserController().getUser(req, res));
userRouter.route('/returnBook').post((req, res) => new user_controller_1.UserController().returnBook(req, res));
userRouter.route('/getAllUsers').get((req, res) => new user_controller_1.UserController().getAllUsers(req, res));
userRouter.route('/delete').post((req, res) => new user_controller_1.UserController().delete(req, res));
userRouter.route('/setStatus').post((req, res) => new user_controller_1.UserController().setStatus(req, res));
exports.default = userRouter;
//# sourceMappingURL=korisnici.router.js.map