import { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { History } from "history";

interface Props {
  history: History;
}

const ScrollToTop = ({ history }: Props): null => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return (): void => {
      unlisten();
    };
  }, []);
  return null;
};

export default withRouter(ScrollToTop);
