export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface UserData {
  user: {
    accountType: string;
    status: string;
  };
  token: string;
}

export interface SocialLoginProvider {
  google: 'google';
  facebook: 'facebook';
} 