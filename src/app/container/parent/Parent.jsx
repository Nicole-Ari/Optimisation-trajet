import { Outlet, useNavigate } from "react-router-dom";
import "./parent.css";
import Button from "react-bootstrap/Button";
function Parent() {
  const Navigate = useNavigate();
  const handleClick = () => {
    Navigate("/");
  };
  return (
    <div className="parent p-4">
      <div className="logo">
        <Button className="btn-logo" onClick={handleClick}>
          Op<span className="text-white">tiRou</span>te
        </Button>
      </div>
      <Outlet />
    </div>
  );
}

export default Parent;
