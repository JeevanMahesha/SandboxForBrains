import { faker } from "@faker-js/faker";
import { test } from "@playwright/test";

const petrolPrices = [
  101.45, 101.6, 101.78, 101.9, 102.08, 101.95, 101.7, 101.5, 101.23,
];
const amounts = [1000];

function getRandomAmount(type: "amount" | "petrol"): number {
  if (type === "petrol") {
    const randomIndex = Math.floor(Math.random() * petrolPrices.length);
    return petrolPrices[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * amounts.length);
    return amounts[randomIndex];
  }
}

Array.from({ length: 1 }).forEach((_, index) => {
  test("test".concat(index.toString()), async ({ page }) => {
    await page.goto("https://freeforonline.com/fuel-bills/index.html");
    await page.getByLabel("Fuel Station Name").click();
    await page.getByLabel("Fuel Station Name").press("ControlOrMeta+a");
    await page.getByLabel("Fuel Station Name").fill("");
    await page.getByLabel("Fuel Rate").click();
    await page
      .getByLabel("Fuel Rate")
      .fill(getRandomAmount("petrol").toString());
    await page.getByLabel("Total Amount").click();
    await page
      .getByLabel("Total Amount")
      .fill(getRandomAmount("amount").toString());
    await page.getByLabel("Customer Name").click();
    await page.waitForTimeout(25000);
    await page.getByLabel("Customer Name").fill("");
    await page.getByLabel("Vehicle Number").click();
    await page.getByLabel("Vehicle Number").fill("");
    await page.getByLabel("Receipt Number").click();
    await page
      .getByLabel("Receipt Number")
      .fill(faker.number.int({ max: 9999, min: 1000 }).toString());
    await page.getByLabel("TXN NO").check();
    await page.locator("#vat-number").click();
    await page.locator("#vat-number").press("ControlOrMeta+a");
    await page.locator("#vat-number").fill(faker.phone.imei());
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download" }).click();
    const download = await downloadPromise;
    await download.saveAs(`${"Saravanan_" + index + 1}-petrol-bill.pdf`);
    await page.close();
  });
});
