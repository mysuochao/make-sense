export class VOCAnnotationsLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = "VOCAnnotationsLoadingError";
    }
}