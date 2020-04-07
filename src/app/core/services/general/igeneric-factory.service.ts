interface IGenericFactoryService<T>{
    add(entity: T): Promise<T>;
    update(entity: T): Promise<T>;
    remove(id) : Promise<T>;
    findById(id) : Promise<T>;
    load();
    getDataGrid();
    validate(entity: T) : Promise<T>;
}