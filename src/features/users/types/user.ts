export type UserProfileType = {
  id: string;
  fullName: string;
  email: string;
  profilePicture?: string;
  isOwner: boolean;
  userNameSlug?: string;
  bio?: string;
  phoneNumber?: string;
  countryCode?: string;
  dateOfBirth?: string;
};
