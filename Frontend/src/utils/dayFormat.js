import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatToVietnamTime = (dateString) => {
    return dayjs(dateString)
        .tz("Asia/Ho_Chi_Minh")
        .format("DD-MM-YYYY HH:mm:ss");
};
