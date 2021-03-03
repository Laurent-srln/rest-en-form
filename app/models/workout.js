class Workout {
    id;
    date;
    content;
    memberId;
    createdAt;
    updatedAt

    set user_id(val){
        this.memberId = val;
    }

    set created_at(val){
        this.createdAt = val;
    }

    set updated_at(val){
        this.updatedAt = val;
    }
    
    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Workout;