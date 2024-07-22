export type TUserFilter = {
  roles?: string;
  genders?: string;
  keywords?: string;
};

export type TUserQueryFilters = {
  range?: {
    start: number;
    end: number;
  };
  sortBy?: {
    column: number;
    order: string;
  };
  filter?: TUserFilter;
};

export type TUserData = {
  email: string;
  password: string;
  roleId: number;
};
