export class Task{
    id:string;
    name:string;
    assignee:string;
    created:Date;
    due:Date;
    followUp:string;
    delegationState:String;
    description:String;
    executionId:String;
    owner:string;
    parentTaskId:String;
    priority:number;
    processDefinitionId:string
    processInstanceId:String;
    taskDefinitionKey:string;
    caseExecutionId:String;
    caseInstanceId:String;
    caseDefinitionId:string;
    suspended:boolean;
    formKey:string;
    tenantId:string;

    //bussinessKey
    businessKey:string
}

export class WorkFlow{
    id:string;
    name:string;
    deploymentTime:Date;
    tenantId:string;
    file:File;
}
export class ProcessDefinition
{
    id:string;
    key:String;
    category:String;
    name:string;
    version:number;
    resource:string;
    deploymentId:string;
    diagram:string;
    suspended:boolean;
    tenantId:string;
    versionTag:string;
    historyTimeToLive:Date;
    startableInTasklist:boolean;
    count:number=0;

}

export class CamundaProcess{
    variables:any[];
    businessKey:String;
}
export class VariableInstance{
    name:String;
    value:any[]
}