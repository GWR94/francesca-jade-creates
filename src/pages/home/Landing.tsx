import React from "react";
import useScreenWidth from "../../hooks/useScreenWidth";
import DesktopLanding from "./components/DesktopLanding";
import MobileLanding from "./components/MobileLanding";

const Landing: React.SFC = (): JSX.Element => {
  const desktop = useScreenWidth(768);
  return <>{desktop ? <DesktopLanding /> : <MobileLanding />}</>;
};

export default Landing;
