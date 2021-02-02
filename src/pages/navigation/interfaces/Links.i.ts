export interface LinksProps {
  mobile?: boolean;
  admin: boolean;
  closeNav: () => void;
  signOut: () => void;
  navOpen: boolean;
  setLoginOpen: () => void;
}
