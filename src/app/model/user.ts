export class User {
    constructor(private username: string, private password: string) {}
    getUser(): Array<string> {
        return [this.username, this.password];
    }
}
export class Token {
    token: string;
    constructor(token: string) {
        this.token = token;
    }
}

export class Register {
    constructor(private name: string, private pw: string, private mail: string) {}
    get self (): Array<string> {
        return [this.name, this.pw, this.mail];
    }
}
