export const userDetail = {
  userName: "",
  userAddress: "",
  userDistrict: "",
  userState: "",
  userCountry: "",
  userPincode: "",
  userPhoneNumber: "",
  userId: "",
  userAccountNumber: "",
  invoiceNumber: "TN-B1-",
  billingPeriod: "",
  invoiceDate: "",
  amountPayable: 0,
  dueDate: "",
  amountAfterDueDate: 0,
  amountSummary: {
    previousBalance: 0,
    invoiceAmount: 0,
    adjustments: 0,
    paymentsReceived: 0,
    balanceAmount: 0,
  },
  thisMonthSummary: {
    totalCharges: 0,
    CGST: 0,
    SGST: 0,
    totalAmount: 0,
  },
  invoiceCharges: {
    planName: "CBE ",
    fromDate: "",
    toDate: "",
    Quantity: 0,
    rental: 0,
    netAmount: 0,
  },
  taxDetails: {
    planName: "CBE ",
    HSNCODE: "998422",
    CGST: 9,
    SGST: 9,

    totalTax: 0,
  },
  paymentsReceived: {
    refNo: "P1-",
    txnDate: "",
    paymentMode: "Online Mode",
    paymentAmount: 0,
    paymentTotal: 0,
    remarks: "PAYTM-Payment for subscriber-",
  },
};