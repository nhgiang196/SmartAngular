//Func Compare date, Quyen
export function withoutTime(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
}

//  -1 : if d1 < d2
//   0 : if d1 = d2
//   1 : if d1 > d2
export function compareDate(d1: Date, d2: Date) {
  let d1withoutTime = withoutTime(d1);
  let d2withoutTime = withoutTime(d2);

  if (d1withoutTime < d2withoutTime)
    return -1;
  else if (d1withoutTime > d2withoutTime) {
    return 1;
  }
  else
    return 0;

}

export function dataCopy(data){
 return JSON.parse(JSON.stringify(data));
}
