import dayjs from 'dayjs';
import 'dayjs/plugin/utc';

import { DateProvider } from './../interfaces/DateProvider';

export class DayjsDateProvider implements DateProvider {

    dateNow(): Date {
        return dayjs().toDate()
    }

    addHours(hours: number): Date {
        return dayjs().add(hours, "hours").toDate()
    }

    isBefore(start_date: Date, end_date: Date): boolean {
        return dayjs(start_date).isBefore(end_date)
    }

}