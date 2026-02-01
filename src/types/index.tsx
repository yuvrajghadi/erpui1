//Login with email 
export interface FieldTypeEmailLogin {
  username?: string;
  password?: string;
};

//Login with OTP
export interface FieldTypeOTP {
  mobileno?: string;
};

//Reset Password
export interface ResetPassword {
  email?: string;
};

//New Password
export interface NewPassword {
  useremail?: string;
  newpassword?: string;
  confirmpassword?: string;
};

//Reset Password Props Types
export interface ResetPasswordProps {
  isModalVisible: boolean;
  onCloseModal: () => void;
}