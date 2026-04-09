import { generateCategory, normalizeInput } from "@/lib/category";
import { connectDB } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { Category } from "@/models/Category";
import { Expense } from "@/models/Expense";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ========== LLM logic ==========
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function getLLMCategory(item: string, merchant?: string, notes?: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const text = `${item} ${merchant || ""} ${notes || ""}`;

  const prompt = `
Classify this expense into ONLY one category:

Categories:
Housing & Utilities,
Food & Essentials,
Transport & Travel,
Health & Wellness,
Personal & Lifestyle,
Financial & Others,

Input: "${text}"

Rules:
- Return ONLY one category name
- No explanation
- No extra words
`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();

  return response.trim();
}

// ========== smart categorization logic ==========
async function getSmartCategory(
  item: string,
  merchant?: string,
  notes?: string,
) {
  const keyword = normalizeInput(item, merchant, notes);

  await connectDB();

  const existing = await Category.findOne({ keyword });
  if (existing) return existing.category;

  let category = generateCategory(item, merchant || "", notes || "");

  const allowedCategories = [
    "Housing & Utilities",
    "Food & Essentials",
    "Transport & Travel",
    "Health & Wellness",
    "Personal & Lifestyle",
    "Financial & Others",
  ];

  if (category === "Other") {
    try {
      const llmCategory = await getLLMCategory(item, merchant, notes);
      if (llmCategory) {
        const cleaned = llmCategory.replace(/[\n.]/g, "").trim();

        if (allowedCategories.includes(cleaned)) {
          category = cleaned;

          await Category.create({ keyword, category }).catch(() => {});
          return category;
        }
      }
    } catch (error) {
      console.error("LLM failed:", error);
    }

    return category;
  }

  try {
    await Category.create({ keyword, category });
  } catch (error) {
    console.error("Category save failed:", error);
  }

  return category;
}

// ========== add expense ==========
export async function addExpense(userId: string, data: any) {
  await connectDB();

  const { amount, item, merchant, notes, date } = data;
  const category = await getSmartCategory(item, merchant ?? "", notes ?? "");
  const expense = await Expense.create({
    userId,
    amount,
    item,
    merchant,
    notes,
    date: date ? new Date(date) : new Date(),
    category,
  });

  return expense;
}

// ========== delete expense ==========
export async function deleteExpense(userId: string, expenseId: string) {
  await connectDB();

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError("Expense not found", 404);

  if (expense.userId.toString() !== userId)
    throw new AppError("Unauthorized", 401);

  await expense.deleteOne();
}

// ========== list expense ==========
export async function listExpense(userId: string) {
  await connectDB();

  return Expense.find({ userId }).sort({ date: -1 });
}

// ========== update expense ==========
export async function updateExpense(userId: string, data: any) {
  await connectDB();

  const { expenseId, amount, item, merchant, notes, date } = data;

  const expense = await Expense.findById(expenseId);
  if (!expense) throw new AppError("Expense not found", 404);

  if (expense.userId.toString() !== userId)
    throw new AppError("Unauthorized", 401);

  let category = expense.category;
  if (item || merchant || notes) {
    category = await getSmartCategory(
      item ?? expense.item,
      merchant ?? expense.merchant,
      notes ?? expense.notes,
    );
  }

  expense.amount = amount ?? expense.amount;
  expense.item = item ?? expense.item;
  expense.merchant = merchant ?? expense.merchant;
  expense.notes = notes ?? expense.notes;
  expense.date = date ? new Date(date) : expense.date;
  expense.category = category;

  await expense.save();

  return expense;
}
