const mongoose = require('mongoose');
const crypto =require('crypto');
const uuidv1 = require('uuid');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    photo: {
        data: Buffer,
        contentType: String
    },
    hashed_password: {
        type: String,
        select: false,
        required: true
    },
    about: {
        type: String
    },
    salt: {
        type: String,
        select: false
    },
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    },
    interests: [{
        type: ObjectId,
        ref: "Category"
    }]
    }, { timestamps: true }
);

// Virtual field 
userSchema.virtual('password')
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password
})


userSchema.methods = {
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex')
        } catch (err) {
            return ''; 
        }
    }
}

module.exports = mongoose.model("User", userSchema);