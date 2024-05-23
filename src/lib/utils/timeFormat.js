import dayjs from 'dayjs';

export const timeFormat = (time, format) => dayjs(time).format(format);
