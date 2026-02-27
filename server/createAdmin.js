require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminUser = {
  username: 'admin',
  password: 'adminpassword123' // User should change this later
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for Admin Creation');

    const existingUser = await User.findOne({ username: adminUser.username });
    if (existingUser) {
      console.log('Admin user already exists');
      process.exit();
    }

    const user = new User(adminUser);
    await user.save();
    console.log('Admin user created successfully');
    console.log('Username:', adminUser.username);
    console.log('Password:', adminUser.password);
    process.exit();
  })
  .catch(err => {
    console.error('Error creating admin user:', err);
    process.exit(1);
  });
