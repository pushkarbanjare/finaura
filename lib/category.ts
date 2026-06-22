export function buildLookupKey(item: string, merchant?: string) {
  return `${item.trim().toLowerCase()}|${merchant?.trim().toLowerCase() || ""}`;
}

export function generateCategory(
  item: string,
  merchant: string,
  notes: string,
) {
  const text = `${item} ${merchant} ${notes}`.toLowerCase();

  const rules = [
    {
      category: "Housing & Utilities",
      keywords: [
        "rent",
        "emi",
        "electricity",
        "water",
        "wifi",
        "broadband",
        "internet",
        "gas",
        "maintenance",
        "bill",
      ],
    },
    {
      category: "Food & Essentials",
      keywords: [
        "zomato",
        "swiggy",
        "food",
        "restaurant",
        "pizza",
        "burger",
        "milk",
        "grocery",
        "vegetable",
        "fruit",
        "blinkit",
        "bigbasket",
        "coffee",
      ],
    },
    {
      category: "Transport & Travel",
      keywords: [
        "uber",
        "ola",
        "rapido",
        "fuel",
        "petrol",
        "diesel",
        "flight",
        "bus",
        "train",
        "taxi",
        "metro",
      ],
    },
    {
      category: "Health & Wellness",
      keywords: [
        "doctor",
        "hospital",
        "medicine",
        "pharmacy",
        "gym",
        "cult",
        "fitness",
        "health",
        "protein",
      ],
    },
    {
      category: "Personal & Lifestyle",
      keywords: [
        "amazon",
        "flipkart",
        "myntra",
        "shopping",
        "clothes",
        "shirt",
        "jeans",
        "netflix",
        "movie",
        "bookmyshow",
        "spotify",
        "salon",
        "haircut",
      ],
    },
    {
      category: "Financial & Others",
      keywords: [
        "tax",
        "insurance",
        "bank",
        "charges",
        "sip",
        "investment",
        "course",
        "education",
        "fee",
      ],
    },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }

  return "Other";
}
