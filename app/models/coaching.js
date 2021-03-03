class Coaching {
    id;
    startTime;
    endTime;
    coachId;
    memberId;
    createdAt;
    updatedAt

    set start_time(val) {
        this.startTime = val;
    }

    set end_time(val) {
        this.endTime = val;
    }

    set coach_id(val){
        this.coachId = val;
    }

    set member_id(val){
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

module.exports = Coaching;