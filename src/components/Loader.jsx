import Logo from "./Logo";

export default function Loader({ hidden }) {
  return (
    <div className={`loader ${hidden ? "hide hidden" : ""}`}>
      <div className="loader-content">
        <div className="logo-mark">
          <Logo variant="navbar" className="logo-img loader-logo-img" />
        </div>
        <div className="loader-line"></div>
      </div>
    </div>
  );
}
