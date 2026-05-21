import { Router } from "express";
import { createStore, getStores, updateStore, deleteStore } from "../controllers/store.controller";

const router = Router();

router.post("/", createStore);
router.get("/", getStores);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);

export default router;
