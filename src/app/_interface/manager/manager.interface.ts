export interface IToast {
  detail: string;
  summary: string;
}

export enum ToastType {
  success = '成功',
  info = '訊息',
  warning = '提示',
  error = '錯誤',
  clear = '清除'
}
