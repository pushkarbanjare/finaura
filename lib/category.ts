export function generateCategory(
  item: string,
  merchant: string,
  notes: string,
) {
  const text = `${item} ${merchant} ${notes}`.toLowerCase();

  // FAST FOOD
  if (
    text.includes("pizza") ||
    text.includes("burger") ||
    text.includes("dominos") ||
    text.includes("kfc") ||
    text.includes("mcdonald") ||
    text.includes("fries")
  ) {
    return "FastFood";
  }

  // GROCERY
  if (
    text.includes("milk") ||
    text.includes("grocery") ||
    text.includes("vegetable") ||
    text.includes("fruit") ||
    text.includes("bigbasket") ||
    text.includes("blinkit")
  ) {
    return "Grocery";
  }

  // TRAVEL
  if (
    text.includes("uber") ||
    text.includes("ola") ||
    text.includes("flight") ||
    text.includes("bus") ||
    text.includes("train") ||
    text.includes("taxi")
  ) {
    return "Travel";
  }

  // SHOPPING
  if (
    text.includes("shirt") ||
    text.includes("jeans") ||
    text.includes("amazon") ||
    text.includes("flipkart") ||
    text.includes("myntra") ||
    text.includes("shopping")
  ) {
    return "Shopping";
  }

  // ENTERTAINMENT
  if (
    text.includes("movie") ||
    text.includes("netflix") ||
    text.includes("bookmyshow")
  ) {
    return "Entertainment";
  }

  // HEALTH
  if (
    text.includes("doctor") ||
    text.includes("hospital") ||
    text.includes("medicine") ||
    text.includes("pharmacy")
  ) {
    return "Health";
  }

  // BILLS
  if (
    text.includes("electricity") ||
    text.includes("recharge") ||
    text.includes("wifi") ||
    text.includes("broadband") ||
    text.includes("waterbill") ||
    text.includes("gas") ||
    text.includes("bills")
  ) {
    return "Bills";
  }

  // FUEL
  if (text.includes("fuel") || text.includes("diesel")) {
    return "Fuel";
  }

  // INVESTMENT
  if (text.includes("sip") || text.includes("invest")) {
    return "Investments";
  }

  return "Other";
}
