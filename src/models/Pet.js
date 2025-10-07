import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specie: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster']
    },
    birthDate: {
        type: Date,
        required: true
    },
    adopted: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Pet', petSchema);