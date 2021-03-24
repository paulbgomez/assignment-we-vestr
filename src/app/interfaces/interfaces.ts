export interface ShareHolder {
  id: number;
  name: string;
  stocks?: StockComplete[];
}

export interface Enterprise{
  id: number;
  name: string;
  totalAmountStock: number;
}

export interface Stock{
  id: number;
  enterpriseId: number;
  shareHolderId: number;
  amount: number;
}

export interface StockComplete extends Stock{
  enterpriseName?: string;
  totalAmountStock?: number;
}
