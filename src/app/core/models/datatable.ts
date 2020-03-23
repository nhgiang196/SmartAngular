export class DataTablePaginationParams {
    key?: string = ''
    keyFields?: string = ''
    page?: number = 0
    pageSize?: number = 0
    orderBy?: string = null
    orderDir?: string = 'asc'
    entity?: string = null
    selectFields?: string = null
    specialCondition?: string =null
  }
  
  export class DataTablesResponse {
    data: any[];
    draw: number = 0;
    recordsFiltered: number = 0;
    recordsTotal: number = 0;
  }
  