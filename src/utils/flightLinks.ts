export const buildGoogleFlightsLink = (
  origin: string,
  destination: string,
  startDate: string
) => {
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(
    `${origin} to ${destination} ${startDate}`
  )}`;
};

export const buildSkyscannerLink = (
  originCode: string,
  destinationCode: string,
  startDate: string
) => {
  const [year, month, day] = startDate.split("-");
  const formatted = `${year.slice(2)}${month}${day}`;

  return `https://www.skyscanner.net/transport/flights/${originCode}/${destinationCode}/${formatted}/`;
};