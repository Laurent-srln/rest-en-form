class Health {
    id;
    weight;
    muscleMass;
    fatMass;
    boneMass;
    bodyWater;
    workoutId;
    createdAt;
    updatedAt

    set muscle_mass(val) {
        this.muscleMass = val
    }

    set fat_mass(val) {
        this.minPlayers = val;
    }
    set bone_mass(val) {
        this.minPlayers = val;
    }
    set body_water(val) {
        this.minPlayers = val;
    }

    set workout_id(val) {
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

module.exports = Health;