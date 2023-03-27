import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import Account from "../models/Account.js";
import ErrorResponse from "../utils/ErrorResponse.js";

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get all Accounts of specific user
// @route   GET /api/v1/accounts/:id/accounts
// @access  Private
export const getUserAccounts = asyncHandler(async (req, res, next) => {
  const accounts = await Account.find({user: req.params.id});

  if (!accounts) {
    return next(
      new Error(`No user accounts found for user that end with id '${req.params.id.slice(-6)}'`)
    );
  }

  res.status(200).json({
    success: true,
    data: accounts,
  });
});


// @desc    Create a User
// @route   POST /api/v1/users
// @access  Private
export const createUser = asyncHandler(async (req, res, next) => {
  const {name, credit, cash} = req.body;

  // const name = req.query.name;
  // const cash = req.query.cash;
  // const credit = req.query.credit;

  let user = await User.find({ name: name });
  console.log(user);

  if (user.length === 0) {
    user = await User.create({ name: name, cash: cash, credit: credit });

    const account = await Account.create({
      cash: cash,
      credit: credit,
      user: user.id,
    });
    user = await User.findByIdAndUpdate(
      user.id,
      { $push: { accounts: account.id } },
      {
        new: true,
      }
    );
  } else {
    const account = await Account.create({
      user: user[0].id,
      cash: cash,
      credit: credit,
    });
    user = await User.findByIdAndUpdate(
      user[0].id,
      { $push: { accounts: account.id }, $inc: { credit: credit, cash: cash } },
      { new: true }
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get a single User
// @route   GET /api/v1/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Get  all users with at least X cash
// @route   GET /api/v1/users/cash_filter
// @access  Public
export const getFilterUsersByCash = asyncHandler(async (req, res, next) => {


  const cash  = req.query.cash;
  const users = await User.find({ cash: { $gte: cash }, isActive: true });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Get  all users with at least X credit
// @route   GET /api/v1/users/credit_filter
// @access  Public
export const getFilterUsersByCredit = asyncHandler(async (req, res, next) => {
  const credit  = req.query.credit;
  const users = await User.find({ credit: { $gte: credit }, isActive: true });

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `User that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }

  user.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
