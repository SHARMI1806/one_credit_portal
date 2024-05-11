import React from "react";
import { GoogleLogout } from "react-google-login";
import { useHistory } from "react-router-dom";

const clientID =
  "329607877296-qvr7df27pu766m1qjuvp6hdlcv6j3gf1.apps.googleusercontent.com";

function Logout() {
  const history = useHistory();
  const onSuccess = (_res) => {
    history.push("/login");
  };
  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientID}
        buttonText={"Logout"}
        onLogoutSuccess={onSuccess}
        className="w-36 h-10"
      />
    </div>
  );
}

export default Logout;
