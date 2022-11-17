import { document } from "./sample";
import React from "react";
import { CITESPermit } from "./CITESPermitTemplate";

export default {
  title: "templates/CITES Permit",
  component: CITESPermit
};

export const CITESPermit_ = (): JSX.Element => {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      <CITESPermit document={document as any} handleObfuscation={() => null} />
    </div>
  );
};
