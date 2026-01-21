export type SignInDto = {
  email: string;
  password: string;
};

export type SignUpDto = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
};

export type ChangePasswordDto = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export type RequestResetPasswordDto = {
  email: string;
};

export type RefreshTokenDto = {
  refreshToken: string;
};

export type SupabaseAuthSession = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at: string;
    phone: string;
    confirmed_at: string;
    last_sign_in_at: string;
    app_metadata: {
      provider: string;
      providers: string[];
    };
    user_metadata: {
      email_verified: boolean;
      fullName: string;
      role?: string;
    };
    identities: {
      identity_id: string;
      id: string;
      user_id: string;
      identity_data: {
        email: string;
        email_verified: boolean;
        phone_verified: boolean;
        sub: string;
      };
      provider: string;
      last_sign_in_at: string;
      created_at: string;
      updated_at: string;
      email: string;
    }[];
    created_at: string;
    updated_at: string;
    is_anonymous: boolean;
  };
};
