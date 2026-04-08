import { Schema, model } from 'mongoose';
/**
* Usuario del sistema
* - email: para login
* - password: hash con bcrypt
* - role: admin / user (opcional para clases futuras)
*/
const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'admin'
        }
    },
    { timestamps: true }
);
export default model('User', userSchema);