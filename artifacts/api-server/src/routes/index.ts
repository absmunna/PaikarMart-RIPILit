import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import sellersRouter from "./sellers";
import ordersRouter from "./orders";
import usersRouter from "./users";
import notificationsRouter from "./notifications";
import adminRouter from "./admin";
import authRouter from "./auth";
import transactionsRouter from "./transactions";
import reviewsRouter from "./reviews";
import disputesRouter from "./disputes";
import kycRouter from "./kyc";
import commissionsRouter from "./commissions";
import milestonesRouter from "./milestones";
import affiliateRouter from "./affiliate";

const router: IRouter = Router();

router.use(authRouter);
router.use(healthRouter);
router.use(productsRouter);
router.use(sellersRouter);
router.use(ordersRouter);
router.use(usersRouter);
router.use(notificationsRouter);
router.use(adminRouter);
router.use(transactionsRouter);
router.use(reviewsRouter);
router.use(disputesRouter);
router.use(kycRouter);
router.use(commissionsRouter);
router.use(milestonesRouter);
router.use(affiliateRouter);

export default router;
