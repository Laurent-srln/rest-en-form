class Workout {
    id;
    date;
    description;;
    createdAt;
    updatedAt;
    memberId;
    memberFirstname;
    memberLastname;
    weight;
    muscleMass;
    fatMass;
    boneMass;
    bodyWater;
    commentCoachId;
    commentCoachFirstname;
    commentCoachLastname;
    commentContent;
    commentDate

    
    set created_at(val){
        this.createdAt = val;
    }
    
    set updated_at(val){
        this.updatedAt = val;
    }
    
    set member_id(val){
        this.memberId = val;
    }
    
    set member_firstname(val){
        this.memberFirstname = val;
    }

    set member_lastname(val){
        this.memberLastname = val;
    }

    set muscle_mass(val){
        this.muscleMass = val;
    }

    set fat_mass(val){
        this.fatMass = val;
    }

    set bone_mass(val){
        this.boneMass = val;
    }

    set body_water(val){
        this.bodyWater = val;
    }

    set comment_coach_id(val){
        this.commentCoachId = val;
    }

    set comment_coach_firstname(val){
        this.commentCoachFirstname = val;
    }

    set comment_coach_lastname(val){
        this.commentCoachLastname = val;
    }

    set comment_content(val){
        this.commentContent = val;
    }

    set comment_date(val){
        this.commentDate = val;
    }
    
    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Workout;