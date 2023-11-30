import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function formatDateAndTime(date?: Date) {
  if (!date) {
    return '';
  }

  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDateToYearOnly(date?: Date) {
  if (!date) {
    return '';
  }

  return dayjs(date).format('YYYY');
}

export function formatTimeFromMilliSeconds(
  msArray: number[],
  withSeconds?: boolean,
) {
  let totalMs = 0;

  msArray.forEach(ms => (totalMs += ms));

  const days = dayjs.duration(totalMs).days();
  const hours = dayjs.duration(totalMs).hours();
  const minutes = dayjs.duration(totalMs).minutes();
  const seconds = dayjs.duration(totalMs).seconds();

  return `${days > 0 ? days + 'd' : ''} ${hours > 0 ? hours + 'h' : ''} ${
    minutes > 0 ? minutes + 'm' : ''
  } ${seconds > 0 && withSeconds ? seconds + 's' : ''}`;
}
