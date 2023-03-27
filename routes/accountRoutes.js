import express from "express";

import {
  getAccount,
  depositMoneyToAccount,
  updateCreditAccount,
  withdrawMoneyFromAccount,
  TransferMoneyFromAccount,
} from "../controllers/accountController.js";


const router = express.Router();

router.route("/:id").get(getAccount);
router.route("/:id/deposit").put(depositMoneyToAccount);
router.route("/:id/update_credit").put(updateCreditAccount);
router.route("/:id/withdraw").put(withdrawMoneyFromAccount);
router.route("/:id/transfer").put(TransferMoneyFromAccount);

export default router;
