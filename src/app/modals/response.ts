
export interface ResponseBody<T> {
  locale?:string;
  status?: any;
  message?: any;
  errors?: any;
  data: T;
  cacheSession?: any;
}

