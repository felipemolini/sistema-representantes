import bcrypt from 'bcrypt';
const SALT = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, SALT);
export const checkPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);
