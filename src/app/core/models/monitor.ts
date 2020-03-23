import { Factory } from './factory'

export class MonitorStandard{
    MonitorStandardId: number
    FactoryId: number
    ValidateDateFrom:any
    ValidateDateTo: any
    MonitorStandardDesc: string
    TemperatureMin: number =0
    TemperatureMax: number =0
    PHmin: number =0
    PHmax: number =0
    Codmin: number =0
    Codmax: number =0
    Tssmin:number =0
    Tssmax: number =0
    ColorMin:number =0
    ColorMax:number =0
    Qmin: number =0
    Qmax:number =0
    AmoniMin:number =0
    AmoniMax: number =0
    CreateBy: string
    CreateDate: Date
    ModifyBy: string
    ModifyDate:Date
    Status: boolean
    FactoryName: string
    Factory: Factory =new Factory()
  }
  
  
  export class MonitorChartTracking
  {
    FactoryId: number =0;
    StartDate: Date = new Date();
    EndDate: Date = new Date();
  }