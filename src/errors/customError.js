export default class CustomError {
    static createError(message) {
        return new Error(message);
    }
}