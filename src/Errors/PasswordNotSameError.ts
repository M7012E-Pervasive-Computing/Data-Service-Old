export class PasswordNotSameError extends Error {
    constructor() {
        super('Password given does not corresponds with the stored password');
    }
}