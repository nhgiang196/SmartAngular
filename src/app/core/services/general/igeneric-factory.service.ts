interface IGenericFactoryService<T>{
    add(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    remove(id) : Promise<T>;
    findById(id) : Promise<T>;
    load();
    getAll();
    getDataGrid(checkStatus:boolean);
    validate(entity: T) : Promise<T>;
    getSelectBox();
    getDataGridUrl(actionLoad:string, actionDelete:string, actionInsert:string, actionUpdate:string, checkStatus:boolean);
    getDataGridWithOutUrl(checkStatus:boolean);
}