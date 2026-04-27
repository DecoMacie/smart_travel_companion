export const buildBookingLink = (
   hotelName: string,
  destination: string,
  checkIn: string,
  checkOut: string
) => {
  return `https://www.google.com/travel/hotels?q=${encodeURIComponent(
    `${hotelName} ${destination}`
  )}&checkin=${checkIn}&checkout=${checkOut}`;
};