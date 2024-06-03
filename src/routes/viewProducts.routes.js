import { Router } from "express";
import productManager from "../productManager.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const styles = ["styles.css", "styles2.css"]
    const products = await productManager.getProducts(limit);
    res.render("index", { styles, products });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Internal Server Error" });
  }
});

export default router;
