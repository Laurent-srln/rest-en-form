class Comment {
    id;
    content;
    authorId;
    workoutId;

    set author_id(val) {
        this.authorId = val;
    }
    set workout_id(val) {
        this.workoutId = val;
    }
    
    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Comment;