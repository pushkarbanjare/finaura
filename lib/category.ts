export function normalizeInput(
  item: string,
  merchant?: string,
  notes?: string,
) {
  const text = `${merchant || ""} ${item} ${notes || ""}`.toLowerCase().trim();

  const words = text.split(" ").filter(Boolean);

  return words[0];
}

export function generateCategory(
  item: string,
  merchant: string,
  notes: string,
) {
  const text = `${item} ${merchant} ${notes}`.toLowerCase();

  const rules = [
    {
      category: "FastFood",
      keywords: ["pizza", "burger", "dominos", "kfc", "mcdonald", "fries"],
    },
    {
      category: "Grocery",
      keywords: [
        "milk",
        "grocery",
        "vegetable",
        "fruit",
        "bigbasket",
        "blinkit",
      ],
    },
    {
      category: "Travel",
      keywords: ["uber", "ola", "flight", "bus", "train", "taxi"],
    },
    {
      category: "Shopping",
      keywords: ["shirt", "jeans", "amazon", "flipkart", "myntra", "shopping"],
    },
    {
      category: "Entertainment",
      keywords: ["movie", "netflix", "bookmyshow"],
    },
    {
      category: "Health",
      keywords: ["doctor", "hospital", "medicine", "pharmacy"],
    },
    {
      category: "Bills",
      keywords: [
        "electricity",
        "recharge",
        "wifi",
        "broadband",
        "waterbill",
        "gas",
      ],
    },
    {
      category: "Fuel",
      keywords: ["fuel", "diesel"],
    },
    {
      category: "Investments",
      keywords: ["sip", "invest"],
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }

  return "Other";
}
