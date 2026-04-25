export const buildGoogleFlightsLink = (
  origin: string,
  destination: string,
  departDate: string,
  returnDate?: string
) => {
  const query = returnDate
    ? `${origin} to ${destination} ${departDate} return ${returnDate}`
    : `${origin} to ${destination} ${departDate}`;

  return `https://www.google.com/travel/flights?q=${encodeURIComponent(
    query
  )}`;
};

const formatDate = (date: string) => {
  const [year, month, day] = date.split("-");
  return `${year.slice(2)}${month}${day}`;
};

export const buildSkyscannerLink = (
  originCode: string,
  destinationCode: string,
  departDate: string,
  returnDate?: string
) => {
  const depart = formatDate(departDate);

  if (returnDate) {
    const ret = formatDate(returnDate);
    return `https://www.skyscanner.net/transport/flights/${originCode}/${destinationCode}/${depart}/${ret}/`;
  }

  return `https://www.skyscanner.net/transport/flights/${originCode}/${destinationCode}/${depart}/`;
};