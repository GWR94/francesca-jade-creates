import React, { FC } from "react";
import background from "../../img/background.jpg";
import Landing from "../../common/Landing";

const Home: FC = (): JSX.Element => {
  return (
    <>
      <div
        style={{
          background: `url(${background}) no-repeat center center fixed`,
        }}
        className="home__background"
      >
        <Landing />
      </div>
    </>
  );
};

export default Home;
