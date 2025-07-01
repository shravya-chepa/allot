import React from "react";
import {
  AppointmentContent,StyledDescription,
  StyledHeading,
  StyledItemWrapper,
  StyledWrapper,
} from "../Student/Student.styled";
const Professor = ({ studentItems }) => {
  
  return (
    <StyledWrapper>
      <StyledHeading>Upcoming Appointments</StyledHeading>
      {studentItems?.map((appointment) => {
        const [datePart, timePart] = appointment.startTime.split("T");

        // Extract date components
        const [year, month, day] = datePart.split("-");

        // Extract time components
        // eslint-disable-next-line
        const [time, studentItems] = timePart.split("Z")[0].split(":");

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const monthName = monthNames[parseInt(month, 10) - 1];

        return (
          <AppointmentContent key={appointment.id}>
            <StyledItemWrapper>
              Date:{" "}
              <StyledDescription>
                {day} {monthName} {year}
              </StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Time: <StyledDescription>{time}:00</StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Student Name: <StyledDescription>{appointment?.student_name}</StyledDescription>
            </StyledItemWrapper>
            <StyledItemWrapper>
              Description:{" "}
              <StyledDescription>{appointment?.description}</StyledDescription>
            </StyledItemWrapper>
          </AppointmentContent>
        );
      })}
    </StyledWrapper>
  );
};

export default Professor;
