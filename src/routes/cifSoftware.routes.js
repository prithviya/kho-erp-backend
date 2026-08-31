const express = require("express");

const router = express.Router();

const controller = require("../controllers/cifSoftware.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.use(authMiddleware, requireAnyRole(["hr"]));

router.post("/", controller.create);

router.get("/", controller.getAll);

router.get("/cif/:cifid", controller.getByCifId);

router.get("/candidate/:candidateId", controller.getByCifId);

router.get("/:id", controller.getById);

router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

module.exports = router;