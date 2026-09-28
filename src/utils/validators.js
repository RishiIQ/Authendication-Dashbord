/**
 * Validation utilities for form fields
 */

export const validators = {
  /**
   * Validates an email address format
   * @param {string} val - The email string to validate
   * @returns {boolean} True if the email is valid
   */
  email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),

  /**
   * Validates password complexity against multiple criteria
   * @param {string} val - The password to validate
   * @returns {Object} Object with boolean flags for each criterion
   *   - length: at least 8 characters
   *   - upper: contains at least one uppercase letter
   *   - lower: contains at least one lowercase letter
   *   - number: contains at least one digit
   *   - special: contains at least one special character
   */
  password: (val) => ({
    length: val.length >= 8,
    upper: /[A-Z]/.test(val),
    lower: /[a-z]/.test(val),
    number: /[0-9]/.test(val),
    special: /[^A-Za-z0-9]/.test(val),
  }),
};

/**
 * Checks if all password strength criteria pass
 * @param {Object} pwdCheck - The result of validators.password()
 * @returns {boolean} True if all checks pass
 */
export const isStrongPassword = (pwdCheck) =>
  pwdCheck.length && pwdCheck.upper && pwdCheck.lower && pwdCheck.number && pwdCheck.special;

/**
 * Storage constants
 */
export const STORAGE_KEY = 'auth_dashboard_session_v1';
export const USERS_DB_KEY = 'auth_dashboard_users_v1';
export const RESET_TOKEN_KEY = 'auth_dashboard_reset_token_v1';
