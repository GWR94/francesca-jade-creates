import React from "react";
import { History } from "history";
import useScreenWidth from "../../hooks/useScreenWidth";
import DesktopLanding from "./components/DesktopLanding";
import MobileLanding from "./components/MobileLanding";

interface LandingProps {
  history: History;
}

const Landing: React.SFC<LandingProps> = (): JSX.Element => {
  const desktop = useScreenWidth(768);
  return <>{desktop ? <DesktopLanding /> : <MobileLanding />}</>;
};

export default Landing;
