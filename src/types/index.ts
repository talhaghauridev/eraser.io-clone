type Team = {
  createdBy: string;
  teamName: string;
  _id: string;
};

type User = {
  _id: string;
  email: string;
  given_name: string;
  picture: string;
  family_name: string;
};

type Files = {
  _id?: string;
  _creationTime: number;
  fileName: string;
  teamId: string;
  createdBy: string;
  archive: boolean;
  document: string;
  whiteboard: string;
  public_url?:string
};

type Nullable<T> = { [P in keyof T]: T[P] | null };
export type { Team, User, Files, Nullable };
