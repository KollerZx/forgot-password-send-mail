export interface DateProvider {
    dateNow(): Date
    addHours(hours: number): Date
    isBefore(start_date: Date, end_date: Date): boolean
}