export type requiredData = {
  basicDetails: {
    name: string;
    address: string;
    district: string;
    state: string;
    country: string;
    pincode: string;
    phone: string;
    userId: string;
    accountNumber: string;
  };
  startBillDate: string;
  planAmount: number;
  planName: string;
  noOfBillRequired: number;
};

export interface Invoice {
  userName: string;
  userAddress: string;
  userDistrict: string;
  userState: string;
  userCountry: string;
  userPincode: string;
  userPhoneNumber: string;
  userId: string;
  userAccountNumber: string;
  invoiceNumber: string;
  billingPeriod: string;
  invoiceDate: string;
  amountPayable: number;
  dueDate: string;
  amountAfterDueDate: number;
  amountSummary: {
    previousBalance: number;
    invoiceAmount: number;
    adjustments: number;
    paymentsReceived: number;
    balanceAmount: number;
  };
  thisMonthSummary: {
    totalCharges: number;
    CGST: number;
    SGST: number;
    totalAmount: number;
  };
  invoiceCharges: {
    planName: string;
    fromDate: string;
    toDate: string;
    Quantity: number;
    rental: number;
    netAmount: number;
  };
  taxDetails: {
    planName: string;
    HSNCODE: string;
    CGST: number;
    SGST: number;
    totalTax: number;
  };
  paymentsReceived: {
    refNo: string;
    txnDate: string;
    paymentMode: string;
    paymentAmount: number;
    paymentTotal: number;
    remarks: string;
  };
}
