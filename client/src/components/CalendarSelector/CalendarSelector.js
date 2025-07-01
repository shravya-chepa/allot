import React from "react";

import { Calendar, theme } from "antd";

const onSelectChange = (value) => {
  console.log(value.format("YYYY-MM-DD"));
};
const CalendarSelector = () => {
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  return (
    <div style={wrapperStyle}>
      <Calendar fullscreen={false} onSelect={onSelectChange} />
    </div>
  );
};

export default CalendarSelector;
