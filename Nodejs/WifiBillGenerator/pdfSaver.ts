import * as fs from "fs-extra";
import * as path from "path";
import puppeteer from "puppeteer";
import { Invoice } from "./mode";

export async function generateInvoicePDF(
  invoiceData: Invoice,
  billGenDate: string
) {
  const htmlTemplate = `
<?xml version="1.0" encoding="UTF-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta content="text/html; charset=iso-8859-1" http-equiv="Content-Type" />
    <title>ACT Invoice</title>
  </head>
  <body style="background-color: #ffffff">
    <table
      style="background-color: #f4f4f4"
      cellspacing="0"
      cellpadding="0"
      align="center"
      width="100%"
    >
      <tr>
        <td>
          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            align="center"
            width="1024"
          >
            <tr>
              <td valign="top" style="background-color: #ffffff" width="300">
                <table
                  style="
                    border-bottom-right-radius: 15px;
                    background-color: #ffffff;
                  "
                  border="0"
                  width="100%"
                >
                  <tr>
                    <td width="50px;" height="30" />
                  </tr>
                  <tr>
                    <td
                      height="110px;"
                      style="padding-left: 10px"
                      align="left"
                      valign="top"
                    >
                      <!-- LOGO start--><img
                        height="120px"
                        alt="logo"
                        src="https://www.actcorp.in/images/soa_images/actlogo.png"
                      /><!-- LOGO ENDS-->
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 20px;
                        color: #ed3036;
                        font-weight: bold;
                        padding-left: 10px;
                      "
                      height="30"
                    >
                      TAX INVOICE
                      <span
                        style="
                          color: #77787b;
                          font-size: 12px;
                          margin-top: 5px;
                          font-weight: normal;
                        "
                        >(Original for the Receipient)</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        padding-left: 10px;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 12px;
                        font-weight: bold;
                      "
                      height="195"
                      width="55%"
                    >
                      <table border="0" width="100%">
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 20px;
                              color: #ed3036;
                              font-weight: bold;
                            "
                          >
                            <span
                              ><img
                                style="
                                  height: 20px;
                                  width: 20px;
                                  vertical-align: text-top;
                                "
                                alt="profile"
                                src="http://img.actcorp.in/mailers/soaimg/Profile.png" /></span
                            ><span style="line-height: 25px">${invoiceData.userName}</span>
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            ${invoiceData.userAddress}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            ${invoiceData.userDistrict}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            ${invoiceData.userState}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            India
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            ${invoiceData.userPincode}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            Home : ${invoiceData.userPhoneNumber}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            Mobile :
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            User Id : ${invoiceData.userId}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            Account No : ${invoiceData.userAccountNumber}
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                            "
                          >
                            Invoice No. : ${invoiceData.invoiceNumber}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td valign="top" style="background-color: #ffffff" width="646">
                <table cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td height="200" />
                  </tr>
                  <tr>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        color: #77787b;
                        font-size: 12px;
                        text-align: right;
                        padding-right: 10px;
                      "
                    >
                      <!-- Address starts --><span>
                        ATRIA CONVERGENCE TECHNOLOGIES LIMITED,</span
                      >
                      <table border="0" width="100%">
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            No:57, Vivekananda street, Ram nagar,
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            Near district police office,
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            Coimbatore-641 009
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            Ph.No : 9121212121,7288999999
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            E-mail : helpdesk@actcorp.in
                          </td>
                        </tr>
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              color: #77787b;
                              font-size: 12px;
                              text-align: right;
                            "
                          >
                            GSTIN : 33AACCA8907B1Z5
                          </td>
                        </tr>
                      </table>
                      <!-- Address ENDS-->
                    </td>
                  </tr>
                  <tr height="20px">
                    <td />
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#FFFFFF">
              <td style="background-color: #ffffff" colspan="3">
                <table cellspacing="0px" cellpadding="5px" width="100%">
                  <tr>
                    <td />
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" colspan="3">
                <table
                  cellspacing="10px"
                  style="background-color: #ffffff"
                  align="center"
                  width="100%"
                >
                  <tr style="height: 110px" align="center">
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #77787b;
                            border: 1px solid #77787b;
                            color: #ffffff;
                          "
                          height="50px"
                        >
                          <td style="font-size: 13px; font-weight: 600">
                            Billing Period
                          </td>
                        </tr>
                        <tr
                          style="
                            background-color: #ffffff;
                            color: #77787b;
                            border: 1px solid #77787b;
                          "
                          height="50px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 18px;
                              font-weight: 600;
                            "
                          >
                            <text> ${invoiceData.billingPeriod} </text>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #77787b;
                            border: 1px solid #77787b;
                            color: #ffffff;
                          "
                          height="50px"
                        >
                          <td style="font-size: 13px; font-weight: 600">
                            Invoice Date
                          </td>
                        </tr>
                        <tr
                          style="
                            background-color: #ffffff;
                            color: #77787b;
                            border: 1px solid #77787b;
                          "
                          height="50px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 18px;
                              font-weight: 600;
                            "
                          >
                            ${invoiceData.invoiceDate}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #77787b;
                            border: 1px solid #77787b;
                            color: #ffffff;
                          "
                          height="50px"
                        >
                          <td style="font-size: 13px; font-weight: 600">
                            Amount Payable
                          </td>
                        </tr>
                        <tr
                          style="
                            background-color: #ffffff;
                            color: #77787b;
                            border: 1px solid #77787b;
                          "
                          height="50px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 18px;
                              font-weight: 600;
                            "
                          >
                            &#x20B9;${invoiceData.amountPayable}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #77787b;
                            border: 1px solid #77787b;
                            color: #ffffff;
                          "
                          height="50px"
                        >
                          <td style="font-size: 13px; font-weight: 600">
                            Due Date
                          </td>
                        </tr>
                        <tr
                          style="
                            background-color: #ffffff;
                            color: #77787b;
                            border: 1px solid #77787b;
                          "
                          height="50px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 18px;
                              font-weight: 600;
                            "
                          >
                            ${invoiceData.dueDate}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #77787b;
                            border: 1px solid #77787b;
                            color: #ffffff;
                          "
                          height="50px"
                        >
                          <td style="font-size: 13px; font-weight: 600">
                            Amount After Due Date
                          </td>
                        </tr>
                        <tr
                          style="
                            background-color: #ffffff;
                            color: #77787b;
                            border: 1px solid #77787b;
                          "
                          height="50px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 18px;
                              font-weight: 600;
                            "
                          >
                            &#x20B9;${invoiceData.amountAfterDueDate}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 14px;
                        font-weight: bold;
                        border-spacing: 0;
                        padding: 0;
                        width: 160px;
                      "
                      cellspacing="0"
                      cellpadding="0"
                    >
                      <table
                        style="border-collapse: collapse; text-align: center"
                        align="center"
                        width="100%"
                      >
                        <tr
                          style="background-color: ffffff; color: #ffffff"
                          height="50px"
                        >
                          <td colspan="2" />
                        </tr>
                        <tr
                          style="background-color: ffffff; color: #ffffff"
                          height="50px"
                        >
                          <td colspan="2">
                            <button
                              style="
                                width: 160px;
                                color: #ffffff;
                                background-color: #ed3036;
                                font-size: 16px;
                                text-transform: uppercase;
                                height: 48px;
                                border: none;
                              "
                            >
                              <a
                                style="
                                  color: #ffffff;
                                  text-decoration: none;
                                  font-weight: 600;
                                "
                                target="_blank"
                                href="https://selfcare.actcorp.in/payments/external-bills?accountNo=108474802523"
                                >PAY BILL</a
                              >
                            </button>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff" colspan="3" />
            </tr>
            <tr bgcolor="#FFFFFF">
              <td style="background-color: #ffffff" colspan="3">
                <table cellspacing="10px" cellpadding="5px" width="100%">
                  <tr>
                    <td
                      style="
                        height: 200px;
                        background-color: #ed3036;
                        width: 50%;
                      "
                    >
                      <table
                        style="border-collapse: collapse"
                        align="center"
                        width="96%"
                      >
                        <tr
                          style="
                            color: #ffffff;
                            border-bottom: 1px solid #f16368;
                          "
                          height="40px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 14px;
                              font-weight: bold;
                              text-align: center;
                            "
                            colspan="2"
                          >
                            Account Summary
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 15px 0 5px 0;
                              text-align: left;
                            "
                          >
                            Previous Due (A)
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 15px 0 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.amountSummary.previousBalance}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: left;
                            "
                          >
                            Invoice Amount (B)
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.amountSummary.invoiceAmount}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: left;
                            "
                          >
                            Adjustments (C)
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.amountSummary.adjustments}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: left;
                            "
                          >
                            Payments Received (D)
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.amountSummary.paymentsReceived}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0 10px 0;
                              text-align: left;
                            "
                          >
                            Balance Amount (A+B-C-D)
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0 15px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.amountSummary.balanceAmount}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td
                      style="
                        height: 200px;
                        background-color: #ed3036;
                        width: 50%;
                      "
                    >
                      <table
                        style="border-collapse: collapse"
                        align="center"
                        width="96%"
                      >
                        <tr
                          style="
                            color: #ffffff;
                            border-bottom: 1px solid #f16368;
                          "
                          height="40px"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 14px;
                              font-weight: bold;
                              text-align: center;
                            "
                            colspan="2"
                          >
                            This Month's Summary
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 15px 0 5px 0;
                              text-align: left;
                            "
                          >
                            Total Charges
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 15px 0 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.thisMonthSummary.totalCharges}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: left;
                            "
                          >
                            CGST
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.thisMonthSummary.CGST}
                          </td>
                        </tr>
                        <tr style="color: #ffffff">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0 20px 0;
                              text-align: left;
                            "
                          >
                            SGST
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 5px 0 20px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.thisMonthSummary.SGST}
                          </td>
                        </tr>
                        <tr
                          style="color: #ffffff; border-top: 1px solid #f16368"
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 10px 0 10px 0;
                              text-align: left;
                            "
                          >
                            Total
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              padding: 10px 0 10px 0;
                              text-align: right;
                            "
                          >
                            &#x20B9;${invoiceData.thisMonthSummary.totalAmount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="background-color: #ffffff" colspan="3">
                <a target="_blank" href="https://www.actcorp.in/"
                  ><img
                    border="0"
                    width="98%"
                    alt="ACT Fibernet "
                    src="http://img.actcorp.in/mailers/soaimg/ROIBanner_01102016.jpg"
                /></a>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff" colspan="3"><br /></td>
            </tr>
            <tr>
              <td
                align="center"
                style="background-color: #ffffff; padding: 10px"
                colspan="3"
              >
                <table cellspacing="10px" bgcolor="#f2f2f2" width="100%">
                  <tr>
                    <td>
                      <table
                        cellspacing="5px"
                        cellpadding="5px"
                        align="center"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              vertical-align: bottom;
                              color: #ed3035;
                            "
                          >
                            <span>Invoice Charges </span>
                          </td>
                          <td>
                            <table style="text-align: right" align="right">
                              <tr>
                                <td
                                  align="right"
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  Account No:
                                </td>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  ${invoiceData.userAccountNumber}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                  colspan="2"
                                >
                                  User Name: ${invoiceData.userId}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        cellspacing="0px;"
                        cellpadding="5px;"
                        border="0"
                        align="center"
                        width="98%"
                      >
                        <tr
                          height="30px;"
                          align="left"
                          style="
                            background-color: #ed3035;
                            color: #ffffff;
                            font-weight: bold;
                          "
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Plan Name
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            From Date
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            To Date
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Quantity
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Rental
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Net Amount
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#FFFFFF" align="left">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.planName}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                           ${invoiceData.invoiceCharges.fromDate}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.toDate}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.Quantity}<text> days</text>
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.rental}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.netAmount}
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#ffffff" align="left">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: right;
                            "
                            colspan="5"
                            align="right"
                          >
                            Sub Total:
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.invoiceCharges.netAmount}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td style="height: 10px" colspan="3" />
            </tr>
            <tr>
              <td
                align="center"
                style="background-color: #ffffff; padding: 10px"
                colspan="3"
              >
                <table cellspacing="10px" bgcolor="#f2f2f2" width="100%">
                  <tr>
                    <td>
                      <table
                        cellspacing="5px"
                        cellpadding="5px"
                        align="center"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              vertical-align: bottom;
                              color: #ed3035;
                            "
                          >
                            <span>Tax Details </span>
                          </td>
                          <td>
                            <table style="text-align: right" align="right">
                              <tr>
                                <td
                                  align="right"
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  Account No:
                                </td>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  ${invoiceData.userAccountNumber}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                  colspan="2"
                                >
                                  User Name: ${invoiceData.userId}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        cellspacing="0px;"
                        cellpadding="5px;"
                        border="0"
                        align="center"
                        width="98%"
                      >
                        <tr
                          height="20px;"
                          align="left"
                          style="
                            background-color: #ed3035;
                            color: #ffffff;
                            font-weight: bold;
                          "
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="2"
                          >
                            Plan Name
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="2"
                          >
                            HSN Code
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="2"
                          >
                            Taxable Amount
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              font-size: 12px;
                              text-align: center;
                            "
                            colspan="2"
                          >
                            CGST
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              font-size: 12px;
                              text-align: center;
                            "
                            colspan="2"
                          >
                            SGST
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              font-size: 12px;
                              text-align: center;
                            "
                            rowspan="2"
                          >
                            Total Tax
                          </td>
                        </tr>
                        <tr
                          height="20px;"
                          align="left"
                          style="
                            background-color: #ed3035;
                            color: #ffffff;
                            font-weight: bold;
                          "
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="1"
                          >
                            Rate %
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="1"
                          >
                            Amount
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            rowspan="1"
                          >
                            Rate %
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              font-size: 12px;
                              text-align: center;
                            "
                            rowspan="1"
                          >
                            Amount
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#FFFFFF" align="left">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.taxDetails.planName}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            <text>998422</text>
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.thisMonthSummary.totalCharges}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            9
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.taxDetails.CGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            9
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.taxDetails.SGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.taxDetails.totalTax}
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#ffffff" align="left">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: right;
                            "
                            colspan="4"
                            align="right"
                          >
                            Sub Total: 
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              padding-left: 10px;
                              text-align: center;
                            "
                            align="right"
                            colspan="1"
                          >
                            ${invoiceData.taxDetails.CGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              padding-left: 10px;
                              text-align: center;
                            "
                            align="right"
                            colspan="1"
                          >
                            <text />
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              padding-left: 10px;
                              text-align: center;
                            "
                            align="right"
                            colspan="1"
                          >
                            ${invoiceData.taxDetails.SGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              padding-left: 10px;
                              text-align: center;
                            "
                            align="right"
                            colspan="1"
                          >
                            ${invoiceData.taxDetails.totalTax}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td style="height: 10px" colspan="3" />
            </tr>
            <tr>
              <td
                align="center"
                style="
                  background-color: #ffffff;
                  padding: 10px;
                  text-align: center;
                "
                colspan="3"
              >
                <table cellspacing="22px" bgcolor="#f2f2f2" width="100%">
                  <tr>
                    <td
                      height="50px"
                      style="background-color: #ed3035"
                      colspan="3"
                    >
                      <table
                        style="height: 50px"
                        align="center"
                        border="0"
                        width="100%"
                      >
                        <tr
                          style="
                            background-color: #ed3035;
                            color: #ffffff;
                            font-weight: bold;
                            text-align: center;
                          "
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              border-right: 1px solid #a7a9ac;
                            "
                            width="20%"
                          >
                            INVOICE AMOUNT:
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              border-right: 1px solid #a7a9ac;
                            "
                            width="12%"
                          >
                            ${invoiceData.thisMonthSummary.totalCharges}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              border-right: 1px solid #a7a9ac;
                            "
                            colspan="2"
                            width="12%"
                          >
                            ${invoiceData.taxDetails.CGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              border-right: 1px solid #a7a9ac;
                            "
                            colspan="2"
                            width="12%"
                          >
                            ${invoiceData.taxDetails.SGST}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              padding-left: 10px;
                            "
                            width="7%"
                          >
                            ${invoiceData.amountPayable}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td style="height: 10px" colspan="3" />
            </tr>
            <tr>
              <td
                align="center"
                style="background-color: #ffffff; padding: 0 10px"
                colspan="3"
              >
                <table
                  style="padding: 0 10px"
                  cellspacing="0px"
                  bgcolor="#f2f2f2"
                  width="100%"
                >
                  <tr>
                    <td>
                      <table
                        cellspacing="5px"
                        cellpadding="5px"
                        align="center"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 16px;
                              vertical-align: bottom;
                              color: #ed3035;
                            "
                          >
                            <span>Payments Received</span>
                          </td>
                          <td>
                            <table style="text-align: right" align="right">
                              <tr>
                                <td
                                  align="right"
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  Account No:
                                </td>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                >
                                  ${invoiceData.userAccountNumber}
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="
                                    font-family: Arial, Helvetica, sans-serif;
                                    font-size: 12px;
                                    color: #58595b;
                                  "
                                  colspan="2"
                                >
                                  User Name:${invoiceData.userId}
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 0; margin: 0">
                      <table
                        cellspacing="0px;"
                        cellpadding="5px;"
                        border="0"
                        align="center"
                        width="98%"
                      >
                        <tr
                          height="30px;"
                          align="center"
                          style="
                            background-color: #ed2027;
                            color: #ffffff;
                            font-weight: bold;
                          "
                        >
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            RefNo
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Txn Date
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Details
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Amount
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Total
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-right: 1px solid #a7a9ac;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Remarks
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#FFFFFF" align="center">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            ${invoiceData.paymentsReceived.refNo}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="center"
                          >
                            ${invoiceData.paymentsReceived.txnDate}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            Payment<text>: Online Mode </text>
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.amountPayable}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.amountPayable}
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: center;
                            "
                          >
                            INSTAPAY-Payment for subscriber - ${invoiceData.userId}
                          </td>
                        </tr>
                        <tr height="30px;" bgcolor="#ffffff" align="center">
                          <td
                            align="right"
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              border-left: 1px solid #a7a9ac;
                              text-align: right;
                            "
                            colspan="4"
                          >
                            Payments :
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                            "
                            align="right"
                          >
                            ${invoiceData.amountPayable}
                          </td>
                          <td
                            align="right"
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: right;
                            "
                            colspan="4"
                          />
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr height="30px;" bgcolor="#ffffff">
              <td
                align="center"
                style="background-color: #ffffff; padding: 0 10px"
                colspan="3"
              >
                <table
                  style="padding: 0 10px 10px 10px"
                  cellspacing="0px"
                  bgcolor="#f2f2f2"
                  width="100%"
                >
                  <tr>
                    <td style="padding: 0; margin: 0">
                      <table
                        cellspacing="0px;"
                        cellpadding="5px;"
                        border="0"
                        align="center"
                        width="98%"
                      >
                        <tr height="30px;" bgcolor="#ffffff" align="center">
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border: 1px solid #a7a9ac;
                              border-top: none;
                              text-align: right;
                              width: 494px;
                            "
                            align="right"
                            colspan="2"
                          >
                            Total Payments :
                          </td>
                          <td
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              text-align: center;
                              width: 60px;
                            "
                            align="right"
                            colspan="2"
                          >
                            ${invoiceData.amountPayable}
                          </td>
                          <td
                            align="right"
                            style="
                              font-family: Arial, Helvetica, sans-serif;
                              font-size: 12px;
                              border-bottom: 1px solid #a7a9ac;
                              border-right: 1px solid #a7a9ac;
                              text-align: right;
                            "
                            colspan="4"
                          />
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td style="height: 10px" colspan="3" />
            </tr>
            <!-- Bank Details for Payment!--><!-- Bank Details for Payment Ends!--><!-- eCMS Details for Payment!--><!-- eCMS Details for Payment Ends!-->
            <tr bgcolor="#ffffff">
              <td style="height: 10px" colspan="3" />
            </tr>
            <tr bgcolor="#ffffff">
              <td colspan="3">
                <table
                  style="border: 1px solid #8b8c8f"
                  cellspacing="20px"
                  cellpadding="10px"
                  align="center"
                  border="0"
                  width="98%"
                >
                  <tr
                    style="
                      font-family: Arial, Helvetica, sans-serif;
                      font-size: 14px;
                    "
                    height="25px;"
                  >
                    <td
                      height="50px"
                      style="
                        border-bottom: 1px solid #8b8c8f;
                        color: #8b8c8f;
                        font-weight: bold;
                      "
                    >
                      Terms and Conditions
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10px;
                        color: #8b8c8f;
                      "
                    >
                      <table
                        style="
                          font-family: Arial, Helvetica, sans-serif;
                          font-size: 12px;
                          background-color: #fff;
                        "
                        cellspacing="0"
                        cellpadding="0"
                        align="center"
                        border="0"
                        width="100%"
                      >
                        <tr>
                          <td>
                            <!-- start Terms and conditions!-->
                            <ol style="line-height: 18px; padding-left: 10px">
                              <li>
                                18% interest will be levied on overdue payments.
                              </li>
                              <li>
                                ACT Shall levy late fee charge in case the bill
                                is paid after the due date.
                              </li>
                              <li>
                                In case of overdue/ defaults, the right to
                                deactivate your services, is reserved.
                              </li>
                              <li>
                                All disputes are subject to Tamil Nadu
                                jurisdiction.
                              </li>
                              <li>
                                Unless otherwise stated,tax on this invoice is
                                not payable under reverse charge.
                              </li>
                              <li>
                                This Invoice is system generated hence signature
                                and stamp is not required.
                              </li>
                            </ol>
                            <!-- End Terms and conditions!-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td height="20px;" colspan="2" />
            </tr>
            <tr bgcolor="#ffffff">
              <td align="center" colspan="3">
                <a
                  target="_blank"
                  href="https://www.actcorp.in/crp-new?utm_source=Bill+Banner&amp;utm_medium=Bill+Banner&amp;utm_campaign=April+22"
                  ><img
                    border="0"
                    width="98%"
                    alt="Image"
                    src="http://img.actcorp.in/mailers/soaimg/payment-img3.jpg"
                /></a>
              </td>
            </tr>
            <tr bgcolor="#ffffff">
              <td height="20px;" colspan="3" />
            </tr>
            <tr bgcolor="#ED2027">
              <td colspan="3">
                <table align="center" border="0" width="80%">
                  <tr height="10px">
                    <td />
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 12px;
                        color: #ffffff;
                      "
                    >
                      Registered office address: No. 1, 2nd and 3rd Floor,
                      Indian Express Building, Queens Road, Bangalore - 560001.
                    </td>
                  </tr>
                  <tr>
                    <td
                      align="center"
                      style="
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10px;
                        color: #ffffff;
                      "
                    >
                      CIN no: U72900KA2000PLC027290 Tel: 08042884288 Fax no:
                      080-42884200
                    </td>
                  </tr>
                  <tr height="10px">
                    <td />
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;

  const outputPath = path.join(
    __dirname,
    `PDF/${billGenDate.replace(/\//g, "-")}.pdf`
  );

  // Save the HTML file
  const htmlFilePath = path.join(__dirname, `profile.html`);
  await fs.writeFile(htmlFilePath, htmlTemplate, "utf8");

  // Launch Puppeteer to convert the HTML to PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Load the HTML content
  await page.setContent(htmlTemplate, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  // Generate PDF
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  console.log(`PDF generated at ${outputPath}`);
}

/*
Example usage
generateUserProfilePDF({
  userName: "John Doe",
  userTitle: "CEO & Founder, Example",
  userUniversity: "Harvard University",
  outputPath: path.join(__dirname, "UserProfile.pdf"),
}); 
*/
