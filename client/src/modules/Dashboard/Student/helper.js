export const helper = (items, studentItems, variableDate) => {

  const filteredProfessorItems = items.filter((profItem) => {
    return !studentItems.some(
      (studItem) => studItem.startTime === profItem.startTime
    );
  });

  function getAllTimeSlots(filteredProfessorItems, variableDate) {
    const filteredItems = filteredProfessorItems?.filter(
      (item) =>
        item.startTime.substring(0, 10) === variableDate.substring(0, 10)
    );
    
    const timeSlots = filteredItems?.map((item) => {
      const startTime = item.startTime.substring(11, 16);
      const itemId = item._id; // Extracting time part
      return { startTime, itemId };
    });
    return timeSlots;
  }

  const timeSlots = getAllTimeSlots(filteredProfessorItems, variableDate);

  return timeSlots;
};