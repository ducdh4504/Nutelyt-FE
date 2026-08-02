const loginLogo = require('@assets/images/Nutelyt-logo.png');
const authWordmark = require('@assets/images/Nutelyt-text.png');
const googleMark = require('@assets/images/auth-google.jpg');
const registerDecoration = require('@assets/images/auth-register-decoration.jpg');
const emailIcon = require('@assets/images/auth-email-icon.svg');
const eyeIcon = require('@assets/images/auth-eye-icon.svg');
const lockIcon = require('@assets/images/auth-lock-icon.svg');
const shieldIcon = require('@assets/images/auth-shield-icon.svg');
const userIcon = require('@assets/images/auth-user-icon.svg');

export const loginAssets = [loginLogo];

export const authAssets = {
  googleMark,
  registerDecoration,
  wordmark: authWordmark,
} as const;

export const authIconAssets = {
  email: emailIcon,
  lock: lockIcon,
  shield: shieldIcon,
  user: userIcon,
} as const;

export { eyeIcon as authEyeIcon };
