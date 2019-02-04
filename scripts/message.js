class Message {
    constructor(message) {
        this.isError = false;
        this.message = message;
    }

    get isError() {
        return this.isError;
    }

    get message() {
        return this.message;
    }
}

class Error extends Message {
    constructor(message, shape) {
        super(message);
        this._isError = true;
        this._shape = shape;
    }

    get shape() {
        return this._shape;
    }

    get point() {
        return this.point;
    }
}
