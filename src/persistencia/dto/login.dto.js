export default class loginDTO {
    constructor(newUser) {
        this.first_name = newUser.full_name.split('')[0];
        this.last_name = newUser.full_name.split('')[1] || '';
        this.emailUser = newUser.email;
    }
}