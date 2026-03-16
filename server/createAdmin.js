require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const adminUser = {
  username: 'admin',
  email: 'admin@portfolio.com',
  password: 'adminpassword123',
  isAdmin: true,
  isApproved: true
};

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB Connected for Admin Setup');

    const existingUser = await User.findOne({ username: adminUser.username });
    if (existingUser) {
      console.log('Updating existing admin user flags...');
      existingUser.isAdmin = true;
      existingUser.isApproved = true;
      if (!existingUser.email) existingUser.email = adminUser.email;
      await existingUser.save();
      console.log('Admin user updated successfully');
      process.exit();
    }

    const user = new User(adminUser);
    await user.save();
    console.log('New Admin user created successfully');
    console.log('Username:', adminUser.username);
    console.log('Password:', adminUser.password);
    process.exit();
  })
  .catch(err => {
    console.error('Error creating admin user:', err.message || err);
    if (err.stack) console.error(err.stack);
    process.exit(1);
  });
