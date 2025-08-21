import { Omit } from '@prisma/client/runtime/library';
import { GenderEnum } from '@prisma/client';

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
    column: string;
    order: string;
  };
  filter?: TUserFilter;
};

export type TUserData = {
  email: string;
  password: string;
  roleId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  profilePicture?: Express.Multer.File;
};

export type TUserProfileData = Omit<TUserData, 'gender' | 'profilePicture'> & {
  gender: GenderEnum;
  avatarUrl?: string;
};
