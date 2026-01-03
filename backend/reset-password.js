import bcrypt from 'bcrypt';
import pool from './db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetPassword() {
  try {
    // Show all users
    const [users] = await pool.execute(
      'SELECT id, email, name FROM users ORDER BY id'
    );

    console.log('\n📋 Registered Users:');
    users.forEach(user => {
      console.log(`  ${user.id}. ${user.email} (${user.name})`);
    });

    rl.question('\nEnter the email address: ', async (email) => {
      rl.question('Enter new password: ', async (password) => {
        try {
          if (password.length < 6) {
            console.log('❌ Password must be at least 6 characters');
            rl.close();
            process.exit(1);
          }

          // Hash the new password
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Update the password
          const [result] = await pool.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [hashedPassword, email]
          );

          if (result.affectedRows === 0) {
            console.log('❌ User not found');
          } else {
            console.log(`✅ Password updated for ${email}`);
            console.log(`\nYou can now login with:`);
            console.log(`  Email: ${email}`);
            console.log(`  Password: ${password}`);
          }

          rl.close();
          process.exit(0);
        } catch (error) {
          console.error('❌ Error:', error.message);
          rl.close();
          process.exit(1);
        }
      });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
  }
}

resetPassword();
