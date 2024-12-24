export const generateTimeSlots = (
  start: string,
  end: string,
  interval: number
): string[] => {
  const slots: string[] = [];
  let currentTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);

  while (currentTime < endTime) {
    slots.push(currentTime.toTimeString().slice(0, 5));

    currentTime = new Date(currentTime.getTime() + interval * 60 * 1000);
  }

  return slots;
};
