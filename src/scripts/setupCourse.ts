
import { createMotorcyclePermitEssentialsCourse } from '@/services/courseCreator';

/**
 * Setup the motorcycle permit essentials course
 */
export async function setupPermitCourse() {
  try {
    console.log('Setting up Motorcycle Permit Essentials course...');
    const course = await createMotorcyclePermitEssentialsCourse();
    console.log('Course created/updated successfully:', course.title);
    return course;
  } catch (error) {
    console.error('Error setting up course:', error);
    throw error;
  }
}
