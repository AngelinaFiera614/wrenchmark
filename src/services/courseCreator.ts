
import { supabase } from "@/integrations/supabase/client";
import { createCourse } from "@/services/courseService";
import { Course, Lesson } from "@/types/course";

/**
 * Create our initial motorcycle permit essentials course
 */
export async function createMotorcyclePermitEssentialsCourse(): Promise<Course> {
  // First check if the course already exists (by title)
  const { data: existingCourse } = await supabase
    .from("courses")
    .select("*")
    .eq("title", "Motorcycle Permit Essentials")
    .maybeSingle();

  if (existingCourse) {
    console.log("Course 'Motorcycle Permit Essentials' already exists");
    return existingCourse;
  }

  // Create the course
  const course = await createCourse({
    title: "Motorcycle Permit Essentials",
    description: "Prepare for your motorcycle permit test with this comprehensive guide covering essential knowledge for riders across all states. Includes state-specific regulations where applicable.",
    slug: "motorcycle-permit-essentials",
    image_url: "/images/courses/permit-essentials.jpg",
    published: true
  });

  // Create the lessons for this course
  await createLessonsForPermitCourse(course.id);
  
  return course;
}

/**
 * Create the initial lessons for the motorcycle permit course
 */
async function createLessonsForPermitCourse(courseId: string) {
  // Define our lesson content
  const lessons = [
    {
      title: "Understanding Motorcycle Controls",
      content: `# Understanding Motorcycle Controls

## Basic Controls Overview

Every motorcycle has a set of standard controls that you must understand before riding. These controls include:

- **Throttle**: Controls engine speed and power
- **Brakes**: Separate controls for front and rear brakes
- **Clutch**: Engages and disengages power to the rear wheel
- **Shifter**: Changes gears
- **Ignition**: Starts the engine

## The Handlebars

The handlebars contain several crucial controls:

- **Right Grip**: Throttle control (twist to accelerate)
- **Right Lever**: Front brake control
- **Left Lever**: Clutch control
- **Switches**: Turn signals, horn, headlight, and starter

## Foot Controls

- **Left Foot**: Gear shifter (1-N-2-3-4-5-6)
- **Right Foot**: Rear brake pedal

Understanding these controls is essential for passing your permit test and riding safely. Practice identifying these controls as they will be on your written test.

## Important Safety Tip

Never ride a motorcycle without first thoroughly understanding all controls and practicing in a safe environment.`,
      slug: "understanding-motorcycle-controls",
      order: 1,
      published: true,
      glossary_terms: ["throttle", "clutch", "transmission"]
    },
    {
      title: "Safe Riding Practices",
      content: `# Safe Riding Practices

## Visibility and Positioning

One of the biggest dangers for motorcyclists is not being seen by other drivers. Always:

- Wear bright or reflective gear
- Use your headlight at all times
- Position yourself in the lane where you are most visible
- Maintain a safe following distance (at least 3-4 seconds)

## Proper Gear

Wearing proper gear is essential for safety and is often tested on permit exams:

- **Helmet**: Must meet DOT standards
- **Eye Protection**: Goggles, face shield, or windshield
- **Jacket**: Abrasion-resistant material with padding
- **Gloves**: Full-fingered for grip and protection
- **Pants**: Long, sturdy material
- **Footwear**: Over-the-ankle boots with non-slip soles

## Lane Positioning

There are three positions within a lane:

1. **Left Track**: Position 1 - Best for being seen by oncoming traffic
2. **Center Track**: Position 2 - Avoid due to oil deposits and debris
3. **Right Track**: Position 3 - Best for being seen by traffic in adjacent lanes

Always choose your lane position based on visibility, road conditions, and traffic flow.

## Scanning Techniques

Develop a proper scanning technique:
- Look 12-15 seconds ahead
- Check mirrors every 5-7 seconds
- Perform head checks before changing lanes or turning

Remember: Proper scanning is crucial for identifying hazards early and is a key part of most motorcycle permit tests.`,
      slug: "safe-riding-practices",
      order: 2,
      published: true,
      glossary_terms: ["lane-position", "following-distance", "blind-spot"]
    },
    {
      title: "Road Signs & Signals",
      content: `# Road Signs & Signals

## Regulatory Signs

These signs inform you of traffic laws and regulations:

- **Stop Sign**: Complete stop required at the stop line
- **Yield Sign**: Give right-of-way to cross traffic
- **Speed Limit**: Maximum legal speed under ideal conditions
- **No Turn Signs**: Prohibited turning movements

## Warning Signs

These yellow signs warn of potential hazards:

- **Curve Signs**: Advise appropriate speed for upcoming curves
- **Intersection Warnings**: Alert to upcoming intersections
- **Road Condition Warnings**: Slippery when wet, gravel road, etc.
- **Motorcycle-Specific Warnings**: Grooved pavement, metal bridges

## Guide Signs

These signs provide directional and distance information:

- **Route Markers**: Identify numbered highways
- **Destination Signs**: Indicate directions to cities/places
- **Service Signs**: Show locations of services (gas, food, etc.)
- **Mileage Signs**: Show distances to destinations

## Motorcycle-Specific Considerations

- Pay special attention to signs warning of conditions particularly hazardous to motorcycles
- Watch for signs indicating toll booths where you may need to stop suddenly
- Construction zone signs require extra caution due to changing road surfaces

Understanding these signs is crucial for passing your motorcycle permit test and riding safely on public roads.`,
      slug: "road-signs-signals",
      order: 3,
      published: true,
      glossary_terms: ["right-of-way", "yield"]
    },
    {
      title: "Riding in Adverse Conditions",
      content: `# Riding in Adverse Conditions

## Rain

Rain presents multiple hazards:

- Reduced visibility
- Reduced traction, especially during the first 30 minutes
- Slippery painted lines and metal surfaces

**Safety tips:**
- Increase following distance to 4+ seconds
- Brake earlier and with less pressure
- Avoid puddles that may hide potholes
- Consider rain gear to stay dry and comfortable

## Wind

Strong winds can push your motorcycle across or out of your lane:

- Anticipate wind when passing large vehicles
- Lean slightly into the wind for stability
- Keep a relaxed but firm grip on handlebars
- Be aware of areas where wind may suddenly change (bridges, open fields)

## Night Riding

Limited visibility makes night riding more dangerous:

- Use your high beam when appropriate
- Wear reflective clothing
- Reduce speed to match your visibility distance
- Be extra alert for animals and road hazards

## Cold Weather

Cold weather affects both you and your motorcycle:

- Dress in layers to maintain body temperature
- Be aware that cold tires have less traction until warmed up
- Watch for ice, especially on bridges and in shaded areas
- Consider that cold hands and feet react more slowly

Understanding how to handle these conditions is important for your permit test and crucial for your safety as a rider.`,
      slug: "riding-adverse-conditions",
      order: 4,
      published: true,
      glossary_terms: ["hydroplaning", "counter-steering", "traction"]
    },
    {
      title: "Group Riding & Legal Basics",
      content: `# Group Riding & Legal Basics

## Group Riding Fundamentals

When riding with others:

- **Staggered Formation**: Maintain a staggered formation in a single lane
- **Safe Spacing**: Keep at least 2 seconds between you and the rider directly in front
- **Communication**: Learn and use hand signals for communication
- **Pre-Ride Meeting**: Always have a pre-ride meeting to discuss route, stops, and signals

## Legal Requirements

Most states require:

- Valid motorcycle license or endorsement
- Proof of insurance with motorcycle coverage
- Registration for your motorcycle
- DOT-approved helmet (in many states)

## Insurance Basics

Motorcycle insurance typically includes:

- **Liability Coverage**: Required in most states
- **Collision Coverage**: Pays for damage to your motorcycle
- **Comprehensive Coverage**: Covers theft, vandalism, etc.
- **Uninsured/Underinsured Motorist**: Protects you from drivers with inadequate insurance

## Passenger Laws

Before carrying passengers:

- Check your state's laws regarding passengers
- Ensure your motorcycle is designed for passengers
- Make sure you have enough experience (some states require a minimum time with license)
- Instruct passengers on proper positioning and communication

Understanding these legal requirements is essential for passing your permit test and riding legally on public roads.`,
      slug: "group-riding-legal-basics",
      order: 5,
      published: true,
      glossary_terms: ["staggered-formation", "endorsement", "liability"]
    },
    {
      title: "Practice Quiz: General Knowledge",
      content: `# Practice Quiz: General Knowledge

This quiz covers material from all previous lessons. Complete it to test your readiness for the actual permit exam.

Good luck!`,
      slug: "practice-quiz-general-knowledge",
      order: 6,
      published: true,
      glossary_terms: []
    }
  ];

  // Create each lesson
  for (const lessonData of lessons) {
    const { data, error } = await supabase
      .from("lessons")
      .insert({
        title: lessonData.title,
        content: lessonData.content,
        slug: lessonData.slug,
        order: lessonData.order,
        course_id: courseId,
        published: lessonData.published,
        glossary_terms: lessonData.glossary_terms
      })
      .select();

    if (error) {
      console.error(`Error creating lesson "${lessonData.title}":`, error);
      throw error;
    } else {
      console.log(`Created lesson: ${lessonData.title}`);
    }
  }

  // Create a quiz for the final lesson
  const { data: quizLesson } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("slug", "practice-quiz-general-knowledge")
    .single();

  if (quizLesson) {
    const { error: quizError } = await supabase
      .from("lesson_quizzes")
      .insert({
        lesson_id: quizLesson.id,
        passing_score: 80,
        questions: [
          {
            id: "1",
            question: "When riding in the rain, you should:",
            options: [
              "Ride in the center of the lane where oil buildup is highest",
              "Increase your following distance to at least 4 seconds",
              "Apply brakes firmly to test traction",
              "Reduce tire pressure for better grip"
            ],
            correct_answer: 1,
            explanation: "Increasing following distance gives you more time to react on slippery surfaces."
          },
          {
            id: "2",
            question: "The front brake on a motorcycle provides what percentage of stopping power?",
            options: [
              "About 25%",
              "About 40%",
              "About 70%",
              "About 90%"
            ],
            correct_answer: 2,
            explanation: "The front brake provides approximately 70% of stopping power."
          },
          {
            id: "3",
            question: "When riding in a staggered formation with a group, you should be:",
            options: [
              "Directly behind the rider in front of you",
              "In the same track as the rider in front of you",
              "In the opposite track from the rider directly in front of you",
              "In whatever position feels comfortable"
            ],
            correct_answer: 2,
            explanation: "In a staggered formation, you ride in the opposite track from the rider directly in front of you."
          },
          {
            id: "4",
            question: "Motorcycle helmets typically need to be replaced:",
            options: [
              "Every year",
              "Every 3-5 years",
              "After any impact or crash",
              "Both B and C"
            ],
            correct_answer: 3,
            explanation: "Helmets should be replaced every 3-5 years due to material degradation and immediately after any crash."
          },
          {
            id: "5",
            question: "When approaching a curve on a motorcycle, you should:",
            options: [
              "Accelerate through the entire curve",
              "Brake during the curve to maintain control",
              "Slow down before the curve, then smoothly accelerate through it",
              "Maintain a constant speed throughout the curve"
            ],
            correct_answer: 2,
            explanation: "Proper technique is to slow before entering the curve, then smoothly accelerate through it."
          }
        ]
      });

    if (quizError) {
      console.error("Error creating quiz:", quizError);
    } else {
      console.log("Created practice quiz for permit course");
    }
  }
}
