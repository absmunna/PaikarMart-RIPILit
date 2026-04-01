import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import sellersRouter from "./sellers";
import ordersRouter from "./orders";
import usersRouter from "./users";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(sellersRouter);
router.use(ordersRouter);
router.use(usersRouter);
router.use(notificationsRouter);
router.use(adminRouter);

export default router;
