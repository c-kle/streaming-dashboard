export const toGbps = (value: number) => {
  const gbpsValue = value / (1000 * 1000 * 1000);

  return `${gbpsValue.toFixed(0)}Gbps`;
};

export const toDateString = (value: number) => {
  const date = new Date(value);

  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

export const toDateTimeString = (value: number) => {
  const date = new Date(value);

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    weekday: 'long',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const msToDays = (value: number) => Math.floor(value / 8.64e7);
