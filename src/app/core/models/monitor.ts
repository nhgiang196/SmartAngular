import { Factory } from './factory'
import { formatDate } from '@angular/common';
const FORMAT_DATE = 'MM/dd/yyyy HH:mm:ss';
const LOCALE = 'en-US';
const CURRENT_DATE = new Date();
const FROM_DATE = (new Date()).setMonth(CURRENT_DATE.getMonth() -1);
export class MonitorStandard {
  MonitorStandardId: number
  FactoryId: number
  ValidateDateFrom: any
  ValidateDateTo: any
  MonitorStandardDesc: string
  TemperatureMin: number = 0
  TemperatureMax: number = 0
  PHmin: number = 0
  PHmax: number = 0
  Codmin: number = 0
  Codmax: number = 0
  Tssmin: number = 0
  Tssmax: number = 0
  ColorMin: number = 0
  ColorMax: number = 0
  Qmin: number = 0
  Qmax: number = 0
  AmoniMin: number = 0
  AmoniMax: number = 0
  CreateBy: string
  CreateDate: Date
  ModifyBy: string
  ModifyDate: Date
  Status: boolean
  FactoryName: string
  Factory: Factory = new Factory()
}
export class Monitor {
  MonitorId: number
  FactoryId: number
  FactoryName: string
  FactoryCode: string
  MonitorDate: string
  Cod: number
  PH: number
  Tss: number
  Q: number
  Color: number
  Amoni: number
  Temperature: number
}
export class ChartFactory {
  factoryId: number;
  dateFrom: string = formatDate(FROM_DATE,FORMAT_DATE,LOCALE);
  dateTo: string = formatDate(CURRENT_DATE,FORMAT_DATE,LOCALE);
}
export class MonitorDescription {
  value: string;
  name: string;
  color: string;
}
