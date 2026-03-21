export const timeSince = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  return `${days}d`;
};
