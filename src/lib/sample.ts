import airtel from "@/images/airtel-logo-icon.svg";
import glo from "@/images/Globacom-Limited-Logo.svg";
import mtn from "@/images/mtn-mobile-logo-icon.svg";
import nineMobile from "@/images/9mobile-seeklogo.svg";

// Sample values for the on-page illustrations. None of this is live data.
export const sample = {
  bloxId: "20481973",
  name: "Adaeze Okonkwo",
  firstName: "Adaeze",
  amount: "₦25,000",
};

// Round, made-up numbers for the "see it before you confirm" card. They are kept
// consistent with each other but are not live rates or real fees.
export const quotes = [
  {
    key: "buy",
    tab: "Buy",
    give: "You pay",
    amount: "₦150,500",
    rate: "₦1,500 per USDT",
    fee: "₦500",
    get: "100 USDT",
  },
  {
    key: "sell",
    tab: "Sell",
    give: "You sell",
    amount: "100 USDT",
    rate: "₦1,500 per USDT",
    fee: "₦500",
    get: "₦149,500",
  },
  {
    key: "swap",
    tab: "Swap",
    give: "You swap",
    amount: "0.01 BTC",
    rate: "1 BTC = 100,000 USDT",
    fee: "2 USDT",
    get: "998 USDT",
  },
];

// Example airtime and data options for the top-up card. Not what any network actually sells.
export const topup = {
  networks: [
    { name: "MTN", logo: mtn },
    { name: "Airtel", logo: airtel },
    { name: "Glo", logo: glo },
    { name: "9mobile", logo: nineMobile },
  ],
  airtime: [100, 200, 500, 1000, 2000, 5000],
  data: [
    { size: "500 MB", valid: "7 days", price: 500 },
    { size: "1.5 GB", valid: "30 days", price: 1000 },
    { size: "3 GB", valid: "30 days", price: 2000 },
    { size: "10 GB", valid: "30 days", price: 5000 },
  ],
};

// Example wallet and history for the app screens. Made up, and not any real person's money.
export const wallet = {
  naira: 482350,
  assets: [
    { sym: "USDT", name: "Tether", amount: "312.50" },
    { sym: "BTC", name: "Bitcoin", amount: "0.0042" },
  ],
};

export const history = [
  {
    id: "t1",
    label: "Sent to Adaeze",
    kind: "Sent",
    amount: "−₦25,000",
    when: "Today, 10:24",
  },
  {
    id: "t2",
    label: "From Tunde",
    kind: "Received",
    amount: "+₦10,000",
    when: "Today, 09:02",
  },
  {
    id: "t3",
    label: "Bought USDT",
    kind: "Crypto",
    amount: "+100 USDT",
    when: "Yesterday",
  },
  {
    id: "t4",
    label: "MTN airtime",
    kind: "Bills",
    amount: "−₦500",
    when: "Yesterday",
  },
  {
    id: "t5",
    label: "Sold USDT",
    kind: "Crypto",
    amount: "−50 USDT",
    when: "Monday",
  },
  {
    id: "t6",
    label: "Sent to Chika",
    kind: "Sent",
    amount: "−₦8,000",
    when: "Sunday",
  },
];
