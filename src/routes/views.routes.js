import { Router } from "express";
import viewProductsRouter from "./viewProducts.routes.js";
import viewRealTimeProductsRouter from "./viewRealTimeProducts.routes.js";

const router = Router();

router.use("/", viewProductsRouter);
router.use("/realtimeproducts", viewRealTimeProductsRouter);

export default router;