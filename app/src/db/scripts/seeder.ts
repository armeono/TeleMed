import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';
import {
  usersTable,
  doctorsTable,
  patientsTable,
} from '../schema'; // Adjust the path to your schema

// Database connection
const connectionString = process.env.DATABASE_URL || ''; // Ensure DATABASE_URL is set in .env
const sql = postgres(connectionString);
const db = drizzle(sql);

(async () => {
  try {
    console.log('Starting seeding process...');

    // Create a doctor user
    const [userDoctor] = await db
      .insert(usersTable)
      .values({
        role: 'DOCTOR',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword123', // Use hashed passwords in real apps
        area: 'SARAJEVO',
        phone: '123456789',
        photo: 'https://example.com/photo/johndoe.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create a patient user
    const [userPatient] = await db
      .insert(usersTable)
      .values({
        role: 'PATIENT',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'janesmith@example.com',
        password: 'hashedpassword456', // Use hashed passwords in real apps
        area: 'UNSKO_SANSKI',
        phone: '987654321',
        photo: 'https://example.com/photo/janesmith.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create a doctor record
    await db.insert(doctorsTable).values({
      userId: userDoctor.id, // Link to the doctor user
      medicalLicense: 'ML12345',
      specialization: 'CARDIOLOGY',
      yearsOfExperience: 10,
      bio: 'Experienced cardiologist with a decade of expertise.',
      area: 'SARAJEVO',
      availability: 'ONLINE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create a patient record
    await db.insert(patientsTable).values({
      userId: userPatient.id, // Link to the patient user
      dateOfBirth: new Date('1990-01-01'),
      medicalId: 'MID67890',
      jmbg: '1234567890123',
      gender: 'FEMALE',
      address: '123 Main Street, Sarajevo',
      area: 'UNSKO_SANSKI',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await sql.end(); // Close the connection
  }
})();
