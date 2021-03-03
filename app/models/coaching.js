class Coaching {
    id;
    startTime;
    endTime;
    coachUserId;
    memberUserId;

    set start_time(val) {
        this.startTime = val;
    }

    set end_time(val) {
        this.endTime = val;
    }

    set coach_user_id(val){
        this.coachUserId;
    }

    set member_user_id(val){
        this.memberUserId;
    }


    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Coaching;