import bcrypt from 'bcrypt';
import pool from './db.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function resetPassword() {
  try {
    // show users, like all of them
    const [users] = await pool.execute('SELECT id, email, name FROM users ORDER BY id');
    console.log('\n📋 Registered Users:');
    users.forEach(u => {
      console.log(`  ${u.id}. ${u.email} (${u.name})`);   // fixed: template literal
    });

    rl.question('\nType the email (the one you remember): ', async (email) => {
      rl.question('Now type the new password, please: ', async (password) => {
        try {
          if (password.length < 6) {
            console.log('❌ password too short, needs more letters or numbers or something');
            rl.close();
            process.exit(1);
          }

          // hash the password, like encrypt but not really reversible
          const saltRounds = 10;
          const hashed = await bcrypt.hash(password, saltRounds);

          // update the thing in database
          const [result] = await pool.execute('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);

          if (result.affectedRows === 0) {                // fixed: added 0
            console.log('❌ user not found maybe wrong email or typo');
          } else {
            console.log(`✅ password updated for ${email}`); // fixed: backticks
            console.log('\nYou can try logging in again, hopefully it works');
            console.log(`   Email: ${email}`);              // fixed: backticks
            console.log(`   Password: ${password}`);         // fixed: backticks
          }

          rl.close();
          process.exit();

        } catch (err) {
          console.error('❌ something broke:', err.message);
          rl.close();
          process.exit(1);
        }
      });
    });
  } catch (err) {
    console.error('❌ unexpected error happened', err.message);
    rl.close();
    process.exit(1);
  }
}

resetPassword();