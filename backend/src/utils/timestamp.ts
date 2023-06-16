import { Timestamp } from "@firebase/firestore";


export const dateToTimestamp = Timestamp.fromDate;
export const timestampToDate = (timestamp: Timestamp) => timestamp.toDate();
