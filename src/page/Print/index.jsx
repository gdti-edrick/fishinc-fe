import React from "react";
import { render, Printer, Text } from "react-thermal-printer";

const Print = () => {
  const doPrint = async () => {
    const data = await render(
      <Printer type="epson">
        <Text>Hello World</Text>
      </Printer>
    );

    const port = await window.navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    const writer = port.writable?.getWriter();
    if (writer != null) {
      await writer.write(data);
      writer.releaseLock();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Test Print</h1>
      <button onClick={doPrint}>Print</button>
    </div>
  );
};

export default Print;
