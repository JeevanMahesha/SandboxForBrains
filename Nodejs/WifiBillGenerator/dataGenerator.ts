import { faker } from "@faker-js/faker";
import { userDetail } from "./sampleData";
import { Invoice, requiredData } from "./mode";

function convertDateFormatWithRegex(dateString: string): string {
  return dateString.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "$2/$1/$3");
}
export function getRandomDateWithin15Days(startDate: Date): Date {
  const startTimestamp = startDate.getTime();
  const randomDays = Math.floor(Math.random() * 14);
  const randomDate = new Date(
    startTimestamp + randomDays * 24 * 60 * 60 * 1000
  );
  return randomDate;
}

function getLastDayOfMonth(date: Date): { lastDay: Date; daysInMonth: number } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  return { lastDay, daysInMonth };
}

export function generateUserData(
  billDetail: requiredData,
  billDate: string
): Invoice {
  const userData = structuredClone(userDetail) satisfies Invoice;

  const GSTAmount = (billDetail.planAmount * 18) / 100;
  const CGST = GSTAmount / 2;
  const SGST = GSTAmount / 2;
  const totalAmountWithGST = billDetail.planAmount + GSTAmount;
  const { lastDay, daysInMonth } = getLastDayOfMonth(new Date(billDate));

  // Basic Details
  userData.userName = billDetail.basicDetails.name;
  userData.userAddress = billDetail.basicDetails.address;
  userData.userDistrict = billDetail.basicDetails.district;
  userData.userState = billDetail.basicDetails.state;
  userData.userCountry = billDetail.basicDetails.country;
  userData.userPincode = billDetail.basicDetails.pincode;
  userData.userPhoneNumber = billDetail.basicDetails.phone;
  userData.userId = billDetail.basicDetails.userId;
  userData.userAccountNumber = billDetail.basicDetails.accountNumber;
  userData.invoiceNumber += faker.number.int(9999999999);
  userData.billingPeriod = `${new Date(billDate).toLocaleString("en-US", {
    month: "short",
  })}, ${new Date(billDate).getFullYear()}`;
  userData.invoiceDate = convertDateFormatWithRegex(billDate);
  let dueDate = new Date(billDate);
  dueDate.setDate(dueDate.getDate() + 14);
  userData.dueDate = convertDateFormatWithRegex(
    dueDate.toLocaleDateString("en-US")
  );
  userData.amountAfterDueDate = totalAmountWithGST + 100;
  userData.amountPayable = totalAmountWithGST;

  // Amount Summary
  userData.amountSummary.previousBalance = totalAmountWithGST;
  userData.amountSummary.invoiceAmount = totalAmountWithGST;
  userData.amountSummary.adjustments = 0;
  userData.amountSummary.paymentsReceived = totalAmountWithGST;
  userData.amountSummary.balanceAmount = totalAmountWithGST;

  // This Month Summary
  userData.thisMonthSummary.totalCharges = billDetail.planAmount;
  userData.thisMonthSummary.CGST = CGST;
  userData.thisMonthSummary.SGST = SGST;
  userData.thisMonthSummary.totalAmount = totalAmountWithGST;

  // Invoice Charges
  userData.invoiceCharges.planName += billDetail.planName;
  userData.invoiceCharges.fromDate = convertDateFormatWithRegex(billDate);
  userData.invoiceCharges.toDate = convertDateFormatWithRegex(
    lastDay.toLocaleDateString("en-US")
  );
  userData.invoiceCharges.Quantity = daysInMonth;
  userData.invoiceCharges.rental = billDetail.planAmount;
  userData.invoiceCharges.netAmount = billDetail.planAmount;

  // Tax Details
  userData.taxDetails.planName += billDetail.planName;
  userData.taxDetails.CGST = CGST;
  userData.taxDetails.SGST = SGST;
  userData.taxDetails.totalTax = GSTAmount;

  // Payments Received
  userData.paymentsReceived.refNo += faker.number.int(999999999).toString();
  userData.paymentsReceived.txnDate = convertDateFormatWithRegex(
    getRandomDateWithin15Days(new Date(billDate)).toLocaleDateString("en-US")
  );
  userData.paymentsReceived.paymentAmount = totalAmountWithGST;
  userData.paymentsReceived.paymentTotal = totalAmountWithGST;
  userData.paymentsReceived.remarks += userData.userAccountNumber;
  return userData;
}
