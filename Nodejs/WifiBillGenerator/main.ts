import { generateUserData } from "./dataGenerator";
import { requiredData } from "./mode";
import { generateInvoicePDF } from "./pdfSaver";

// Provide the required data to generate the bills
const requiredData = {
  basicDetails: {
    name: "Saravanan P",
    address:
      " 43a, IVA AGAM Villas Vazhiyampalayam Post, Vasanth Nagar, Kalapatti, Coimbatore, Tamilnadu",
    district: "Coimbatore",
    state: "Tamil Nadu",
    country: "India",
    pincode: "641035",
    phone: "+91 8056562847",
    userId: "108287656786",
    accountNumber: "108287656786",
  },
  startBillDate: "2025/01/01",
  planAmount: 1325,
  planName: "ACT Zoom",
  noOfBillRequired: 1,
} satisfies requiredData;

// No need to change anything below this line

function generateSequentialDates(startDate: Date, count: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    dates.push(date.toLocaleDateString());
  }
  return dates;
}

const billDates = generateSequentialDates(
  new Date(requiredData.startBillDate),
  requiredData.noOfBillRequired
);

const billDetails = billDates.map((date) =>
  generateUserData(requiredData, date)
);

for (const bill of billDetails) {
  generateInvoicePDF(bill, bill.billingPeriod);
}
