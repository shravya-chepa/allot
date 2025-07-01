import React from "react";
import { useHistory } from "react-router-dom";
import {
  HeaderStyle,
  HeaderContent,
  LogoWrapper,
  SignOutButton
} from "./Header.styled";

import AppLogo from "../../assets/images/logo.png";

const Header = () => {
  const history = useHistory();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    history.push("/");
  };

  return (
    <HeaderStyle>
      <HeaderContent>
        <LogoWrapper>
          <a href="/dashboard">
            <img src={AppLogo} alt="logo" width="80" />
          </a>
        </LogoWrapper>
        <SignOutButton onClick={handleSignOut}>Sign Out</SignOutButton>
      </HeaderContent>
    </HeaderStyle>
  );
};

export default Header;
