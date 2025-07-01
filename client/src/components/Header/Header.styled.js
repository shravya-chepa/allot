import styled from "styled-components";

export const HeaderStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100%;
  height: 72px;
  border-bottom: 1px solid #ebebeb;
  background-color: #fff;

  img {
    padding-left: 40px;
    padding-right: 40px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const SignOutButton = styled.button`
  margin-right: 40px;
  padding: 8px 16px;
  background-color: #ac1330;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #910f28;
  }
`;
