const { Expense } = require('../models/Expense.model');
const { Op } = require('sequelize');

function normalize({ id, userId, spentAt, title, amount, category, note }) {
  return {
    id,
    userId,
    spentAt,
    title,
    amount,
    category,
    note,
  };
}

async function getAllExpenses() {
  const result = await Expense.findAll();

  return result;
}

async function getExpensesByUser(userId) {
  const expenses = await Expense.findAll({ where: { userId } });

  return expenses;
}

async function getExpensesBetweenDates(from, to) {
  const expenses = await Expense.findAll({
    where: { spentAt: { [Op.between]: [from, to] } },
  });

  return expenses;
}

async function getExpenseByCategories(categories) {
  let categoryList = categories;

  if (typeof categories === 'string') {
    categoryList = categories.includes(',')
      ? categories.split(',')
      : [categories];
  } else if (!Array.isArray(categories)) {
    categoryList = [categories];
  }

  const expenses = await Expense.findAll({
    where: { category: { [Op.in]: categoryList } },
  });

  return expenses;
}

async function getExpenseById(id) {
  return Expense.findByPk(id);
}

async function createExpense(newExpense) {
  const expense = await Expense.create(newExpense);

  return expense;
}

async function deleteExpense(id) {
  await Expense.destroy({ where: { id } });
}

async function updateExpense({ id, ...params }) {
  const expense = await Expense.findByPk(id);

  if (!expense) {
    return null;
  }

  const updatedExpense = await expense.update(params, { silent: true });

  return updatedExpense;
}

module.exports = {
  normalize,
  getAllExpenses,
  getExpensesByUser,
  getExpensesBetweenDates,
  getExpenseByCategories,
  getExpenseById,
  createExpense,
  deleteExpense,
  updateExpense,
};
