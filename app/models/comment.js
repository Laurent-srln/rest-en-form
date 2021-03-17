class Comment {
    id;
    content;
    coachId;
    coachFirstname;
    coachLastname;
    workoutId;
    createdAt;
    updatedAt

    set coach_id(val){
        this.coachId = val;
    }

    set coach_firstname(val){
        this.coachFirstname = val;
    }

    set coach_lastname(val){
        this.coachLastname = val;
    }

    set workout_id(val){
        this.workoutId = val;
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

module.exports = Comment;