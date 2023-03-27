import express from 'express';
import {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  getFilterUsersByCash,
  getFilterUsersByCredit,
  getUserAccounts
} from '../controllers/userController.js';




import advancedResults from '../middleware/advancedResults.js';
import User from '../models/User.js';

const router = express.Router();

//----------------------------advance res?
router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);


router
.route('/cash_filter')
.get(getFilterUsersByCash);

router
.route('/credit_filter')
.get(getFilterUsersByCredit);

router
  .route('/:id')
  .get(getUser)
  .delete(deleteUser);

  router
  .route('/:id/accounts')
  .get(getUserAccounts);


export default router;