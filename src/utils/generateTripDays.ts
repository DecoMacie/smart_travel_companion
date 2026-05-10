export const generateTripDays = (
  startDate: string,
  endDate: string,
) => {
  const days: { dayNumber: number; date: string }[] = [];

  const current = new Date(startDate);
  const end = new Date(endDate);

  let dayNumber = 1;

  while (current <= end) {
    days.push({
      dayNumber,
      date: current.toISOString().split("T")[0],
    });

    current.setDate(current.getDate() + 1);
    dayNumber++;
  }

  return days;
};