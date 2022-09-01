class Health {
    id;
    createdAt;
    updatedAt;
    workoutId;
    workoutDate;
    weight;
    muscleMass;
    fatMass;
    boneMass;
    bodyWater;
    memberId;
    memberFirstname;
    memberLastname


    set created_at(val){
        this.createdAt = val;
    }

    set updated_at(val){
        this.updatedAt = val;
    }

    set workout_id(val) {
        this.workoutId = val;
    }

    set workout_date(val) {
        this.workoutDate = val;
    }

    set muscle_mass(val) {
        this.muscleMass = val
    }

    set fat_mass(val) {
        this.fatMass = val;
    }

    set bone_mass(val) {
        this.boneMass = val;
    }

    set body_water(val) {
        this.bodyWater= val;
    }

    set member_id(val) {
        this.memberId = val;
    }

    set member_firstname(val) {
        this.memberFirstname = val;
    }

    set member_lastname(val) {
        this.memberLastname = val;
    }

    
    constructor(data) {
        for (const prop in data) {
            this[prop] = data[prop];
        }
    }
}

module.exports = Health;