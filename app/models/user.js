class User {
    id;
    firstname;
    lastname;
    email;
    role;

    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = User;