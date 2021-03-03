class Workout {
    id;
    date;
    content;
    userId;

    set user_id(val){
        this.userId = val;
    }
    
    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Workout;