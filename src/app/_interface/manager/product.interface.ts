
export interface Product {
  id?: string;
  code?: string;
  name: string; // 名稱
  description?: string; // 描述
  price?: number; // 價格
  quantity?: number; // 數量
  inventoryStatus?: string; // 庫存狀態
  category?: string; // 種類
  imageList: string[]; // 照片集
  rating?: number; // 評分
  isOnShelf: boolean; // 是否上架
  createTimestamp?: any; // 建立時間戳記
  lastEditTimestamp?: any; // 最後編輯時間戳記
}

export class Product {
  constructor() {
    this.name = '';
    this.imageList = [];
    this.isOnShelf = true;
  }
}
