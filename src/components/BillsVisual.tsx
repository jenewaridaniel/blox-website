import Image from "next/image";
import { topup } from "@/lib/sample";

const naira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

// The networks, amounts and bundles on one card. A picture of the choice, with nothing to press.
export default function BillsVisual() {
  return (
    <div className="fxn">
      <p className="fxn-label">Networks</p>
      <ul className="fxn-nets">
        {topup.networks.map(({ name, logo }) => (
          <li key={name}>
            <span className="topup-logo">
              <Image src={logo} alt="" width={28} height={28} />
            </span>
            {name}
          </li>
        ))}
      </ul>

      <p className="fxn-label">Airtime</p>
      <ul className="fxn-chips">
        {topup.airtime.map((value) => (
          <li key={value}>{naira(value)}</li>
        ))}
      </ul>

      <p className="fxn-label">Data</p>
      <ul className="fxn-bundles">
        {topup.data.map((item) => (
          <li key={item.size}>
            <strong>{item.size}</strong>
            <span>
              {item.valid} · {naira(item.price)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
