export interface Birthday {
   day: string;
   month: string;
   year: string;
}

export interface Education {
   schoolName: string;
   startYear: string;
   endYear: string;
}
export interface Information {
   name: string;
   email: string;
   phone: string;
   gender: string;
   skills: Array<string>;
   birthday: Array<Birthday[]>;
   education: Array<Education>;
}
