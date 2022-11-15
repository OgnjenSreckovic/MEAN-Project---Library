import { Router } from "express";
import storage from "../storage";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();


userRouter.route('/register').post(
    storage,
    (req, res) => new UserController().register(req, res)
);

userRouter.route('/registerCheck').post(
    (req, res) => new UserController().registerCheck(req, res)
);

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)
);

userRouter.route('/changePassword').post(
    (req, res) => new UserController().changePassword(req, res)
);

userRouter.route('/infoChangeCheck').post(
    (req, res) => new UserController().infoChangeCheck(req, res)
);


userRouter.route('/changeInfo').post(
    (req, res) => new UserController().changeInfo(req, res)
);

userRouter.route('/changeProfilePicture').post(
    storage,
    (req, res) => new UserController().changeProfilePicture(req, res)
)

userRouter.route('/rentBook').post(
    (req, res) => new UserController().rentBook(req, res)
);


userRouter.route('/getUser').get(
    (req, res) => new UserController().getUser(req, res)
);

userRouter.route('/returnBook').post(
    (req, res) => new UserController().returnBook(req, res)
);

userRouter.route('/getAllUsers').get(
    (req, res) => new UserController().getAllUsers(req, res)
);

userRouter.route('/delete').post(
    (req, res) => new UserController().delete(req, res)
);

userRouter.route('/setStatus').post(
    (req, res) => new UserController().setStatus(req, res)
)

export default userRouter;