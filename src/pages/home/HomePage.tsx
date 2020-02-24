import React, { FC } from "react";
import background from "../../img/background.jpg";
import Landing from "./components/Landing";

const Home: FC = (): JSX.Element => {
  return (
    <>
      <div className="home__background">
        <Landing />
      </div>
    </>
  );
};

export default Home;
