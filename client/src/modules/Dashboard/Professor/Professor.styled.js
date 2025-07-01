import styled from "styled-components";

export const AppointmentContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 50px;
  background-color: #f2f2f2;
  padding: 20px 30px;
  border-bottom: solid 0.7px;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    gap: 50px;
  }
`;

export const StyledTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 30px;
  /* color:#828282 */
`;
