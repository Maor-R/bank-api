import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Account from "../models/Account.js";
import ErrorResponse from "../utils/ErrorResponse.js";


// @desc    Get an Account of specific user
// @route   GET /api/v1/accounts/:id
// @access  Private
export const getAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);

  if (!account) {
    return next(
      new Error(`Account that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: account,
  });
});



// @desc    Deposit money to account of a specific user
// @route   PUT /api/v1/accounts/:id/deposit
// @access  Private
export const depositMoneyToAccount = asyncHandler(async (req, res, next) => {
  const  cash = req.query.cash;
  if (cash <= 0) {
    return next(new Error(`The amount of money must be positive`));
  }

  const account = await Account.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { cash: cash, credit: cash  },
    },
    {
      new: true,
    }
  );
  const user = await User.findByIdAndUpdate(account.user, {
    $inc: { cash: cash, credit: cash  },
  });

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: account,
  });
});

// @desc    Update credit account of a specific user
// @route   PUT /api/v1/accounts/:id/update_credit
// @access  Private
export const updateCreditAccount = asyncHandler(async (req, res, next) => {
  const  credit  = req.query.credit;

  if (credit <= 0) {
    return next(new Error(`The amount of credit must be positive`));
  }

  let account = await Account.findByIdAndUpdate(req.params.id, {
    credit: credit,
  });
  const diffCredit = credit - account.credit;
  account.credit += diffCredit;
  const user = await User.findByIdAndUpdate(account.user, {
    $inc: { credit: diffCredit },
  });

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }
  res.status(200).json({
    success: true,
    data: account,
  });
});

// @desc    Withdraw money from account of a specific user
// @route   PUT /api/v1/accounts/:id/withdraw
// @access  Private
export const withdrawMoneyFromAccount = asyncHandler(async (req, res, next) => {
  let cash  = req.query.cash;
  let accountUpdated;

  if (cash <= 0) {
    return next(new Error(`The amount of money must be positive`));
  }
  const account = await Account.findById(req.params.id);

  if (account.credit >= cash) {
    cash *=-1;
      accountUpdated = await Account.findByIdAndUpdate(
        req.params.id,
        { $inc: { credit: cash, cash: cash } },
        {
          new: true,
        }
      );
      const user = await User.findByIdAndUpdate(
        account.user,
        { $inc: { credit: cash, cash: cash } }
      );

      if (!user) {
        return next(
          new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
        );
      }
    

  } 
  else {
    return next(
      new Error(
        `Sorry, the operation failed, the amount of credit in the account is too low`
      )
    );
  }

  res.status(200).json({
    success: true,
    data: accountUpdated,
  });
});



// @desc    Transfer money from account to another account of a specific user
// @route   PUT /api/v1/accounts/:id/transfer
// @access  Private
export const TransferMoneyFromAccount = asyncHandler(async (req, res, next) => {
  let cash  = req.query.cash;
  const  accountNumber  = req.query.accountNumber;;
  let accountUpdated;

  if (cash <= 0) {
    return next(new Error(`The amount of money must be positive`));
  }
  const account = await Account.findById(req.params.id);

  if (account.credit >= cash) {
    if (account.cash >= cash) {
      cash*=-1;
      accountUpdated = await Account.findByIdAndUpdate(
        req.params.id,
        { $inc: { credit: cash,  cash: cash } },        {
          new: true,
        }
      );
      const user = await User.findByIdAndUpdate(
        account.user,
        { $inc: { credit: cash,  cash: cash } },
      );

      if (!user) {
        return next(
          new Error(`User that end with '${account.user.slice(-6)}' not found`)
        );
      }

      cash*=-1;
      const targetAccountUpdated = await Account.findByIdAndUpdate(
        accountNumber,
        { $inc: { credit: cash,  cash: cash } },
        {
          new: true,
        }
      );
      const targetUser = await User.findByIdAndUpdate(
        targetAccountUpdated.user,
        { $inc: { credit: cash ,  cash: cash} },
      );

      if (!targetUser) {
        return next(
          new Error(`User that end with '${targetAccountUpdated.user.slice(-6)}' not found`)
        );
      }
    }

  } 
  else {
    return next(
      new Error(
        `Sorry, the operation failed, the amount of credit in the account is too low`
      )
    );
  }

  res.status(200).json({
    success: true,
    data: accountUpdated,
  });
});



