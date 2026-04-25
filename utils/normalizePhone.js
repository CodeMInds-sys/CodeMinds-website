function normalizePhone(input) {
  if (!input) return null;

  // 1. شيل أي حاجة مش رقم
  let phone = input.replace(/\D/g, "");

  // ======================
  // 🇪🇬 مصر
  // ======================
  if (phone.startsWith("20")) {
    phone = "0" + phone.slice(2);
  }

  if (phone.startsWith("1") && phone.length === 10) {
    phone = "0" + phone;
  }

  // تحقق مصري
  if (/^01[0-25][0-9]{8}$/.test(phone)) {
    return phone;
  }

  // ======================
  // 🇸🇦 السعودية
  // ======================
  if (phone.startsWith("966")) {
    phone = "0" + phone.slice(3);
  }

  if (phone.startsWith("5") && phone.length === 9) {
    phone = "0" + phone;
  }

  // تحقق سعودي
  if (/^05[0-9]{8}$/.test(phone)) {
    return phone;
  }

  // ❌ لو مش مطابق لأي دولة
  return null;
}

module.exports = normalizePhone;
