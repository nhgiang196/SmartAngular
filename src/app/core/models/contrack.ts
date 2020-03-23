import { Files } from './file'

export class Contract {
	ContractId: number = 0
	CustomerId?: number = 0
	ContractNo?: string
	ContractCode?: string
	ContractType?: number = 2
	SignDate?: any
	EffectiveDate?: any
	EndDate?: any
	StandardType?: number = 2
	Ratio?: any = 0
	Description?: string
  IsIntergration?: boolean = true
  ContractPrice : ContractPrice[] = []
  ContractBreach : ContractBreach[] = []
  ContractFile : ContractFile[] = []
}

export class ContractPrice {
	ContractPriceId: number = 0
	ContractId?: number = 0
	Ratio?: any = 0
	Currency?: string = null
	Price?: any = 0
	Tax?: any = 0
}

export class ContractBreach {
	ContractBreachId: number= 0
	ContractId?: number = 0
	BreachType: number
	ResolveType?: number
	Times?: number  = 1
}



export class ContractFile {
  ContractFileId: number = 0
  ContractId: number = 0
  FileId: number = 0
  Url: string = null
  File: Files = new Files()
}