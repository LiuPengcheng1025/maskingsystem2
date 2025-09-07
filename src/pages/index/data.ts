export type listParams = {
    current?: number;
    pageSize?: number;
  };

export type listData = {
    address: string;
    /**
     * 备注
     */
    descr: string;
    id: string;
    name: string;
    phone: string;
    /**
     * 职位
     */
    position: string;
    [property: string]: any;
  };