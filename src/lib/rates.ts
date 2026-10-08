import { quotes as sampleQuotes } from "@/lib/sample";

export type Quote = (typeof sampleQuotes)[number];
export type Rates = { btc: number; usdt: number };

// CoinGecko's markets endpoint, asked only for the two coins the card uses and priced in Naira.
// (The full top-100 list with sparklines is about 400 KB and takes seconds; this is about 1 KB.)
// The free public API needs no key and allows browser requests. It asks for credit, see Trade.tsx.
const MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=ngn&ids=bitcoin,tether&order=market_cap_desc&per_page=2&page=1&sparkline=false";

export async function fetchRates(signal: AbortSignal): Promise<Rates> {
  const response = await fetch(MARKETS, {
    signal,
    headers: { accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Rates request failed: ${response.status}`);

  const rows = (await response.json()) as {
    id: string;
    current_price: number;
  }[];
  const price = (id: string) =>
    rows.find((row) => row.id === id)?.current_price;
  const btc = price("bitcoin");
  const usdt = price("tether");
  if (!btc || !usdt || !Number.isFinite(btc) || !Number.isFinite(usdt))
    throw new Error("Rates response was missing a price");

  return { btc, usdt };
}

// The amounts and fees match the sample card. Only the rate is live, so the fee is still an example.
const PAY_NAIRA = 150_500;
const SELL_USDT = 100;
const SWAP_BTC = 0.01;
const FEE_NAIRA = 500;
const FEE_SWAP_USDT = 2;

const naira = (value: number, digits = 0) =>
  `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
const usdt = (value: number, digits = 2) =>
  `${value.toLocaleString("en-NG", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} USDT`;

export function buildQuotes(rates: Rates): Quote[] {
  // Work from the rates as they are shown, so the figures on the card always add up.
  const nairaPerUsdt = Math.round(rates.usdt * 100) / 100;
  const usdtPerBtc = Math.round(rates.btc / rates.usdt);
  const perUsdt = `${naira(nairaPerUsdt, 2)} per USDT`;

  return [
    {
      key: "buy",
      tab: "Buy",
      give: "You pay",
      amount: naira(PAY_NAIRA),
      rate: perUsdt,
      fee: naira(FEE_NAIRA),
      get: usdt((PAY_NAIRA - FEE_NAIRA) / nairaPerUsdt),
    },
    {
      key: "sell",
      tab: "Sell",
      give: "You sell",
      amount: `${SELL_USDT} USDT`,
      rate: perUsdt,
      fee: naira(FEE_NAIRA),
      get: naira(Math.round(SELL_USDT * nairaPerUsdt - FEE_NAIRA)),
    },
    {
      key: "swap",
      tab: "Swap",
      give: "You swap",
      amount: `${SWAP_BTC} BTC`,
      rate: `1 BTC = ${usdtPerBtc.toLocaleString("en-NG")} USDT`,
      fee: `${FEE_SWAP_USDT} USDT`,
      get: usdt(SWAP_BTC * usdtPerBtc - FEE_SWAP_USDT),
    },
  ];
}

// One shared request, so every section that wants prices reuses the same answer.
let shared: Promise<Rates> | undefined;

export function loadRates(): Promise<Rates> {
  if (!shared) {
    const request = new AbortController();
    const timeout = window.setTimeout(() => request.abort(), 8000);
    shared = fetchRates(request.signal).finally(() =>
      window.clearTimeout(timeout),
    );
    // A failed request is forgotten, so a later section gets to try again.
    shared.catch(() => {
      shared = undefined;
    });
  }
  return shared;
}

// The USDT to Naira scene: how much Naira 100 USDT comes to at the rate on show, before fees.
export const CONVERT_USDT = 100;

export function buildConvert(rates: Rates | null) {
  const rate = rates ? Math.round(rates.usdt * 100) / 100 : 1500;
  return {
    live: rates !== null,
    rate,
    rateText: `₦${rate.toLocaleString("en-NG", {
      minimumFractionDigits: rates ? 2 : 0,
      maximumFractionDigits: rates ? 2 : 0,
    })}`,
    amount: Math.round(CONVERT_USDT * rate),
  };
}
