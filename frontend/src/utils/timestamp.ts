import { Timestamp } from "@firebase/firestore";

export const dateToTimestamp = Timestamp.fromDate;

export const createTimestamp = (seconds: number, nanoseconds: number) => {
  try {
    return Timestamp.fromMillis(seconds * 1000 + nanoseconds / 1000000);
  } catch (error) {
    console.error('Failed to create timestamp from seconds and nanoseconds: ', seconds, nanoseconds);
    return null;
  }
};

export const timestampToDate = (timestamp: any) => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  } else if (timestamp._seconds !== undefined && timestamp._nanoseconds !== undefined) {
    const createdTimestamp = createTimestamp(timestamp._seconds, timestamp._nanoseconds);
    if (createdTimestamp) {
      return createdTimestamp.toDate();
    }
  }
  console.error('Invalid argument passed to timestampToDate: ', timestamp);
  return null;
}

export const timestampToM_D = (timestamp: any) => {
  const date = timestampToDate(timestamp);
  if (date) {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  } else {
    console.error('Invalid argument passed to timestampToM_D: ', timestamp);
    return null;
  }
}
