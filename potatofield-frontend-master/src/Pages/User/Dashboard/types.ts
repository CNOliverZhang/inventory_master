import { AUTH_TYPE } from '@/Constants/authType';

export interface Credential {
  authType: AUTH_TYPE;
  identifier: string;
}

export interface CredentialForm extends Credential {
  password?: string;
  confirmingPassword?: string;
  verificationCode?: string;
}
