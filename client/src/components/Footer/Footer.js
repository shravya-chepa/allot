import React from "react";
import { FooterStyle } from "./Footer.styled";

const Footer = () => {
  return (
    <FooterStyle>
      <div className="footer__info-block">
        <div className="copyryght-block">
          <span className="copyright">©2024 </span>
          <span>All Rights Reserved.</span>
        </div>
      </div>
    </FooterStyle>
  );
};

export default Footer;
