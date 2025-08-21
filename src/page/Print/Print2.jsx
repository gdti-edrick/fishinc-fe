import React, { useRef } from "react";

import "./index.css";

const PrintPage = () => {
  const printRef = useRef(null);

  const isAndroid = () => {
    return /android/i.test(navigator.userAgent);
  };

  const handlePrint = () => {
    if (!printRef.current) return;

    if (isAndroid()) {
      // 🔸 RawBT for Android
      const rawText = printRef.current.innerText;
      const encoded = encodeURIComponent(rawText);
      window.location.href = `rawbt:${encoded}`;
    } else {
      // 🖨️ Browser Print for Desktop
      const printContents = printRef.current.innerHTML;
      const printWindow = window.open("", "", "width=350,height=600");

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Receipt</title>
            <style>
              @media print {
body {
  margin: 0;
  padding: 8px;
  width: 80mm;
  font-size: 14px;
}

p {
  margin: 0;
  font-weight: 400;
}

hr {
  border: none;
  border-top: 1px dashed #000;
  margin: 6px 0;
}

.flex {
  display: flex;
}
.flex-1 {
  flex: 1;
}

.flex-column {
  flex-direction: column;
}
.flex-row {
  flex-direction: row;
}

.font-16 {
  font-size: 16px;
}

.font-18 {
  font-size: 18px;
}

.font-bold {
  font-weight: bold;
}
.font-normal {
  font-weight: normal;
}

.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
.text-right {
  text-align: right;
}

.logo-box {
  width: 24mm;
  height: 16mm;
  padding: 0px;
  background-color: gray;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mr-10 {
  margin-right: 10px;
}
.mt-60 {
  margin-top: 60px;
}

.w-100px {
  width: 100px;
}

.w-full {
  width: 100%;
}
.w-half {
  width: 50%;
}

.border-collapse {
  border-collapse: collapse;
}

.border {
  border: 1px solid #000;
}
.border-none {
  border: none;
}
.break-word {
  word-break: break-word;
}



              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            <div class="receipt">${printContents}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const totalSum = "35.455.000";
  return (
    <div style={{ padding: 20, width: "80mm" }}>
      <div ref={printRef} style={{ fontWeight: "bold", fontSize: "14px" }}>
        <div className="flex flex-row">
          <div className="logo-box">logo</div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <p>Tanggal: 23 April 2025</p>
            <p>13:57</p>
            <p>INVxxxxxxxxx</p>
          </div>
        </div>

        <br />
        <p className="text-center font-16 font-bold">INVOICE PENJUALAN</p>
        <br />
        <p>GADING SERPONG</p>
        <p>
          RUKO FINANCIAL CENTER BLOCK BA2NO.48, JL.BOULVERAD, GADING SERPONG,
          TANGERANG
        </p>

        <br />

        <p>PHONE CAll: 021-000-000</p>

        <br />

        <p>PELANGGAN: {dummyData.name}</p>

        {dummyData2.map((item, index) => (
          <div key={index} className="flex flex-row">
            <p className="w-100px">{item.title}</p>
            <p className="mr-10">:</p>
            <p className="flex-1 break-words">{item.value}</p>
          </div>
        ))}

        <br />

        <table className="border-collapse w-full text-center" cellPadding={8}>
          <thead>
            <tr>
              <th className="border">Curr.</th>
              <th className="border">Amount</th>
              <th className="border">Rate</th>
              <th className="border">Total</th>
            </tr>
          </thead>
          <tbody>
            {dummyData3.map((item, index) => (
              <tr key={index}>
                <td className="border">{item.curr}</td>
                <td className="border">{item.amount}</td>
                <td className="border">{item.rate}</td>
                <td className="border">{item.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right font-bold border-none">
                Rp.
              </td>
              <td className="font-bold border-none">{totalSum}</td>
            </tr>
          </tfoot>
        </table>

        <br />
        <p>DEALER NAME: RUDY</p>

        <br />
        <p>
          Dengan menyatakan bahwa pembelian Lorem ipsum, dolor sit amet
          consectetur{" "}
        </p>

        <br />

        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="text-left w-half font-normal">
                <p className="text-center"> Served By</p>
              </th>
              <th className="text-left w-half font-normal">
                <p className="text-center">Customer</p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="w-half font-normal">
                <div className="mt-60">(BERNANDOCRISTIAN)</div>
              </td>
              <td className="w-half font-normal">
                <div className="mt-60"> (.....................)</div>
              </td>
            </tr>
          </tbody>
        </table>

        <br />
        <br />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi vitae
          cumque
        </p>
        <br />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi vitae
          cumque
        </p>
        <br />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi vitae
          cumque
        </p>
      </div>
      <button onClick={handlePrint}>Print Receipt</button>
    </div>
  );
};

export default PrintPage;

const dummyData = {
  name: "ADHI SUCHITA",
  noClif: "041000",
  alamat: "PABUARAN TUMPENG RT 004 RW 003 KARAWACI TANGERANG",
  noTelp: "081234567890",
  asalDana: "TABUNGAN",
  tujuanTransaksi: "BIAYA PERJALANAN",
  kuasa: "ADHI SUCHITA",
  idKuasa: "0231312120312341",
};

const dummyData2 = [
  {
    title: "No. Clif",
    value: dummyData.noClif,
  },
  {
    title: "Alamat",
    value: dummyData.alamat,
  },
  {
    title: "No. Telp",
    value: dummyData.noTelp,
  },
  {
    title: "Asal Dana",
    value: dummyData.asalDana,
  },
  {
    title: "Tujuan Transaksi",
    value: dummyData.tujuanTransaksi,
  },
  {
    title: "Kuasa",
    value: dummyData.kuasa,
  },
  {
    title: "ID Kuasa",
    value: dummyData.idKuasa,
  },
];

const dummyData3 = [
  {
    curr: "THB",
    amount: "50.000",
    rate: "506.5",
    total: "25.325.000",
  },
  {
    curr: "THB",
    amount: "20.000",
    rate: "506.5",
    total: "10.130.000",
  },
];
