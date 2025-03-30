const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema, 'roles'); // Chỉ định collection là "roles"
module.exports = Role;
