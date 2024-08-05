import UserController from "../controllers/userController";
import auth from "../middlewares/auth";
import admin from "../middlewares/admin";
import  {Router} from "express";
import upload from "../middlewares/upload";


const router = Router();

// Route for getting getting all user
router.get('/',[auth, admin], UserController.getUsers);

// Route for creating new user
router.post("/",  upload.single("profile"), UserController.registerUser);

// a route for getting the user  by id
router.get('/:id', UserController.getUserById)

router.put('/:id',  upload.single("profile"), auth, UserController.updateUserInfo);

// an route for deleting the user
router.delete('/:id', auth, UserController.deleteUserInfo)



export default router;

