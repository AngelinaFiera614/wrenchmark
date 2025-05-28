
import { supabase } from '@/integrations/supabase/client';
import { createLesson } from '@/services/lessonService';

interface LessonData {
  title: string;
  content: string;
  order: number;
  glossary_terms?: string[];
}

interface CourseContent {
  courseSlug: string;
  lessons: LessonData[];
}

export const createCourseContent = async (courseContent: CourseContent) => {
  // Get course by slug
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('id')
    .eq('slug', courseContent.courseSlug)
    .single();

  if (courseError || !course) {
    throw new Error(`Course not found: ${courseContent.courseSlug}`);
  }

  // Create lessons in sequence
  const createdLessons = [];
  for (const lessonData of courseContent.lessons) {
    try {
      const lesson = await createLesson({
        course_id: course.id,
        title: lessonData.title,
        content: lessonData.content,
        order: lessonData.order,
        slug: lessonData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        published: false,
        glossary_terms: lessonData.glossary_terms || []
      });
      createdLessons.push(lesson);
    } catch (error) {
      console.error(`Error creating lesson: ${lessonData.title}`, error);
    }
  }

  return createdLessons;
};

// Course content definitions
export const motorcycleBasics101Content: CourseContent = {
  courseSlug: 'motorcycle-basics-101',
  lessons: [
    {
      title: 'Introduction to Motorcycles',
      order: 1,
      glossary_terms: ['motorcycle', 'engine', 'transmission'],
      content: `# Welcome to Motorcycle Basics 101

## What You'll Learn
This comprehensive course introduces you to the world of motorcycles. Whether you're a complete beginner or looking to refresh your knowledge, you'll gain essential understanding of motorcycle fundamentals.

## Motorcycle Categories

### Sport Bikes
- High-performance motorcycles designed for speed and agility
- Forward-leaning riding position
- Powerful engines with high RPM capabilities
- Examples: Yamaha YZF-R1, Honda CBR1000RR

### Cruisers
- Relaxed riding position with feet forward
- Low seat height and laid-back style
- Often feature V-twin engines
- Examples: Harley-Davidson Sportster, Indian Scout

### Touring Bikes
- Built for long-distance comfort
- Large fuel tanks and storage capacity
- Wind protection and comfortable seating
- Examples: Honda Gold Wing, BMW K1600GT

### Adventure/Dual Sport
- Versatile bikes for on and off-road riding
- Higher ground clearance and suspension travel
- Upright riding position
- Examples: BMW GS series, KTM Adventure

### Standard/Naked Bikes
- No fairings, upright riding position
- Versatile for commuting and recreation
- Good balance of comfort and performance
- Examples: Yamaha MT-07, Kawasaki Z650

## Basic Motorcycle Anatomy

### Frame and Chassis
The backbone of the motorcycle that holds everything together. Modern frames are typically made of steel or aluminum.

### Engine
The heart of the motorcycle. Most modern bikes use 4-stroke internal combustion engines ranging from single cylinders to V8s.

### Transmission
Transfers power from the engine to the rear wheel. Most motorcycles use manual transmissions with 5-6 gears.

### Suspension
- **Front**: Usually telescopic forks
- **Rear**: Typically a monoshock or dual shock system

### Brakes
- **Front**: Usually disc brakes (one or two discs)
- **Rear**: Disc or drum brake
- Many modern bikes include ABS (Anti-lock Braking System)

## Next Steps
In the following lessons, we'll dive deeper into safety gear, controls, and basic maintenance. Take your time to understand these fundamentals—they form the foundation for everything else you'll learn.`
    },
    {
      title: 'Essential Gear and Safety',
      order: 2,
      glossary_terms: ['helmet', 'abs', 'atgatt'],
      content: `# Essential Motorcycle Gear and Safety

## ATGATT: All The Gear, All The Time
Safety should always be your top priority when riding. The acronym ATGATT reminds us to wear proper protective gear every time we ride.

## Helmet Selection

### Types of Helmets
- **Full Face**: Maximum protection, covers entire head and face
- **Modular**: Flip-up chin bar for convenience
- **Open Face**: Covers top and sides of head, jaw exposed
- **Half Helmet**: Minimal coverage, not recommended for beginners

### Safety Standards
Look for these certifications:
- **DOT** (Department of Transportation) - Minimum legal requirement in most states
- **ECE** (Economic Commission for Europe) - European standard
- **Snell** - Private testing organization with strict standards

### Fit and Comfort
- Helmet should be snug but not painful
- No pressure points after 15-20 minutes of wear
- Minimal movement when shaking your head
- Replace every 5 years or after any impact

## Protective Clothing

### Jackets
- **Leather**: Excellent abrasion resistance, classic look
- **Textile**: Often waterproof, better ventilation options
- **Mesh**: Maximum airflow for hot weather
- Look for CE-rated armor in shoulders, elbows, and back

### Pants
- Matching jacket and pants provide best protection
- Riding jeans with Kevlar lining as minimum
- Avoid regular clothing—road rash is serious

### Gloves
- Full-finger gloves essential
- Look for palm sliders and knuckle protection
- Different gloves for different weather conditions

### Boots
- Over-the-ankle protection minimum
- Oil-resistant, non-slip soles
- Reinforced toe and heel areas
- Avoid laces that can get caught

## Visibility and Weather Protection

### High-Visibility Gear
- Bright colors and reflective materials
- LED light strips and reflective tape
- Headlight modulators for daytime visibility

### Weather Considerations
- **Rain**: Waterproof gear and good tires
- **Cold**: Layering system and heated gear options
- **Hot**: Ventilated gear and hydration planning

## Pre-Ride Safety Check (T-CLOCS)

### T - Tires and Wheels
- Check tire pressure and tread depth
- Look for cuts, cracks, or embedded objects
- Ensure wheels are properly aligned

### C - Controls
- Test throttle, clutch, and brake operation
- Check that controls return to neutral position
- Verify smooth operation without binding

### L - Lights and Electrics
- Test headlight, taillight, turn signals
- Check horn operation
- Verify battery connections are secure

### O - Oil and Other Fluids
- Check engine oil level and color
- Verify brake fluid levels
- Look for any fluid leaks

### C - Chassis
- Check chain tension and lubrication
- Inspect suspension for leaks or damage
- Ensure all bolts are properly tightened

### S - Stands and Switches
- Test kickstand and centerstand operation
- Verify kill switch and starter function
- Check that kickstand safety switch works

## Emergency Preparedness
- First aid kit basics
- Emergency contact information
- Roadside assistance coverage
- Basic tool kit for minor repairs

Remember: The best safety gear is the gear you actually wear. Find equipment that's comfortable and fits well so you'll use it consistently.`
    },
    {
      title: 'Controls and Operation',
      order: 3,
      glossary_terms: ['throttle', 'clutch', 'brake', 'transmission'],
      content: `# Motorcycle Controls and Operation

## Understanding the Controls
Before you can safely operate a motorcycle, you must understand all the controls and their functions. Unlike a car, motorcycles require coordination between both hands and both feet.

## Hand Controls

### Right Hand - Throttle and Front Brake
- **Throttle**: Twist grip controls engine speed
  - Roll toward you to accelerate
  - Roll away to decelerate
  - Spring-loaded to return to idle
- **Front Brake Lever**: Operates front brake
  - Use 2-3 fingers for control
  - Progressive application is key
  - Provides 70-80% of total braking power

### Left Hand - Clutch and Other Controls
- **Clutch Lever**: Disengages engine from transmission
  - Pull to disconnect engine from rear wheel
  - Essential for shifting gears
  - Use 2-3 fingers for best control
- **Horn Button**: Usually located on left switch cluster
- **Turn Signal Switch**: Toggle left/right
- **High/Low Beam Switch**: Headlight control

## Foot Controls

### Right Foot - Rear Brake and Gear Shift
- **Rear Brake Pedal**: Operates rear brake
  - Use ball of your foot
  - Provides 20-30% of braking power
  - Important for low-speed control
- **Gear Shift Lever**: Changes transmission gears
  - Up for higher gears (2, 3, 4, 5, 6)
  - Down for lower gears (N, 1)
  - Standard pattern: 1-N-2-3-4-5-6

### Left Foot - Nothing (on most bikes)
- Some bikes have heel/toe shifters
- Electric start bikes typically don't use left foot

## Starting the Engine

### Pre-Start Checklist
1. Ensure motorcycle is in neutral
2. Turn on fuel petcock (if equipped)
3. Turn ignition key to "ON"
4. Check that kill switch is in "RUN" position

### Starting Procedure
1. Pull in clutch lever
2. Press electric start button OR kick start
3. Let engine warm up for 30-60 seconds
4. Check that neutral light is on

## Basic Operation Sequence

### Getting Moving
1. **Start engine** and let warm up
2. **Pull in clutch** fully
3. **Shift into first gear** (down from neutral)
4. **Slowly release clutch** while gently adding throttle
5. **Find friction zone** - point where clutch begins to engage
6. **Gradually release clutch** completely while adding more throttle

### Shifting Gears
1. **Roll off throttle** slightly
2. **Pull in clutch** quickly and completely
3. **Shift up** with firm, quick motion
4. **Release clutch** smoothly while adding throttle
5. **Timing is crucial** - practice makes perfect

### Stopping
1. **Roll off throttle** completely
2. **Apply both brakes** progressively
3. **Pull in clutch** as speed decreases
4. **Downshift to first gear** (or neutral)
5. **Put left foot down** when stopped

## The Friction Zone
The friction zone is the most critical concept for new riders. It's the point where the clutch plates begin to engage and transfer power.

### Finding the Friction Zone
- Start with engine running in neutral
- Pull in clutch and shift to first gear
- Very slowly release clutch until you feel the bike want to move
- This is the friction zone - practice finding it consistently

### Using the Friction Zone
- **Starting**: Use friction zone to control initial movement
- **Slow Speed**: Modulate clutch in friction zone for precise control
- **Hill Starts**: Hold in friction zone while adding throttle

## Common Beginner Mistakes

### Stalling
- Usually caused by releasing clutch too quickly
- Or not giving enough throttle when starting

### Jerky Starts
- Result of poor clutch and throttle coordination
- Practice smooth, gradual movements

### Engine Racing
- Giving too much throttle with clutch pulled in
- Learn to coordinate clutch release with throttle application

## Practice Exercises

### Friction Zone Control
1. Find friction zone without moving
2. Practice starts on level ground
3. Practice very slow speed maneuvers

### Smooth Shifting
1. Practice shifting without engaging clutch (bike off)
2. Practice rev-matching while stationary
3. Gradually increase shifting speed

Remember: Smooth operation comes with practice. Start slowly and build muscle memory through repetition. Every motorcycle is slightly different, so take time to get familiar with your specific bike's controls.`
    },
    {
      title: 'Basic Maintenance Fundamentals',
      order: 4,
      glossary_terms: ['oil', 'chain', 'tire', 'maintenance'],
      content: `# Basic Motorcycle Maintenance

## Why Maintenance Matters
Regular maintenance keeps your motorcycle safe, reliable, and running efficiently. Unlike cars, motorcycles require more frequent attention due to their design and operating conditions.

## Maintenance Schedule Overview

### Every Ride (Pre-Ride Check)
- Tire pressure and condition
- Brake operation
- Lights and signals
- Chain tension and lubrication
- Fluid levels

### Weekly/500 Miles
- Chain cleaning and lubrication
- Tire pressure check
- Visual inspection for leaks or damage

### Monthly/1000 Miles
- Engine oil level check
- Brake fluid level
- Battery terminals
- Air filter inspection

### Every 3000-5000 Miles
- Oil and filter change
- Chain adjustment
- Brake pad inspection
- Spark plug inspection

## Chain Maintenance

### Why Chain Care is Critical
The chain transfers power from the engine to the rear wheel. A poorly maintained chain can:
- Cause power loss
- Wear sprockets prematurely
- Break and potentially lock the rear wheel

### Chain Inspection
- **Tension**: Should have 1-2 inches of play
- **Alignment**: Chain should run straight
- **Wear**: Look for stretched links or stiff spots
- **Lubrication**: Should be clean and properly lubed

### Chain Cleaning Process
1. **Warm up chain** with short ride
2. **Secure bike** on center stand or rear stand
3. **Apply chain cleaner** to entire chain
4. **Scrub with brush** to remove dirt and old lube
5. **Rinse with water** (avoid high pressure on bearings)
6. **Dry thoroughly** with clean rag
7. **Apply fresh chain lube** to inside of chain while slowly rotating wheel
8. **Let lube penetrate** for 5-10 minutes before riding

### Chain Adjustment
- Follow manufacturer's specifications
- Adjust at tightest point of chain
- Ensure rear wheel alignment
- Check tension after first 100 miles

## Tire Care and Inspection

### Tire Pressure
- **Check when cold** (not ridden for 3+ hours)
- **Use accurate gauge** - don't trust gas station gauges
- **Follow manufacturer specs** (found on bike or in manual)
- **Check weekly** - tires naturally lose 1-2 PSI per month

### Tread Depth
- **Legal minimum**: 1/32" in most states
- **Safe replacement**: 2/32" or when wear bars show
- **Measurement**: Use penny test or tread depth gauge
- **Even wear**: Indicates proper inflation and alignment

### Tire Inspection Points
- **Sidewall cracks**: Age-related damage
- **Punctures**: Nails, screws, or other debris
- **Irregular wear**: Alignment or suspension issues
- **Age**: Replace every 5-6 years regardless of wear

## Oil Basics

### Why Oil Changes Matter
Engine oil lubricates, cools, and cleans internal engine parts. Motorcycles work harder than cars and need more frequent oil changes.

### Checking Oil Level
1. **Warm engine** to operating temperature
2. **Let bike sit upright** for 5 minutes
3. **Check sight glass** or dipstick
4. **Oil level** should be between min/max marks
5. **Add oil** if needed, don't overfill

### Oil Change Frequency
- **Conventional oil**: Every 3,000 miles
- **Synthetic blend**: Every 5,000 miles  
- **Full synthetic**: Every 7,500 miles
- **Check manual** for manufacturer recommendations

### Oil Types
- **Conventional**: Cheapest, adequate for older bikes
- **Synthetic blend**: Good performance/price balance
- **Full synthetic**: Best protection, longer intervals
- **Motorcycle-specific**: Designed for wet clutches

## Basic Tool Kit

### Essential Tools
- **Metric socket set**: 8mm, 10mm, 12mm, 14mm, 17mm
- **Hex keys (Allen wrenches)**: 4mm, 5mm, 6mm, 8mm
- **Screwdrivers**: Phillips and flathead, various sizes
- **Pliers**: Needle nose and standard
- **Tire pressure gauge**: Digital preferred
- **Chain tools**: Cleaning brush, lube applicator

### Maintenance Supplies
- **Chain cleaner and lube**: Brand specific to your chain type
- **Engine oil**: Correct viscosity for your bike
- **Brake cleaner**: For cleaning brake components
- **Shop rags**: Lint-free cloths
- **Disposable gloves**: Nitrile or latex

## Safety While Maintaining

### Workshop Safety
- **Secure the bike**: Use proper stands
- **Work on level ground**: Prevent bike from falling
- **Good lighting**: See what you're doing
- **Ventilation**: Important when using chemicals
- **Fire safety**: Keep extinguisher nearby

### Chemical Safety
- **Read labels**: Follow all safety instructions
- **Wear protection**: Gloves, safety glasses
- **Proper disposal**: Don't dump oil or chemicals
- **Clean up spills**: Prevent slips and environmental damage

## When to Seek Professional Help

### DIY vs. Professional
- **Basic maintenance**: Oil changes, chain care, tire pressure
- **Intermediate**: Brake pad replacement, valve adjustments
- **Professional**: Engine work, electrical issues, suspension rebuild

### Finding a Good Shop
- **Reputation**: Ask other riders for recommendations
- **Certifications**: Look for manufacturer training
- **Communication**: Shop should explain work needed
- **Estimates**: Get written estimates for major work

Remember: Regular maintenance prevents expensive repairs. Start with basic tasks and gradually build your skills and confidence. When in doubt, consult your owner's manual or a qualified technician.`
    },
    {
      title: 'Introduction to Tools and Safety',
      order: 5,
      glossary_terms: ['torque', 'tool', 'safety'],
      content: `# Introduction to Motorcycle Tools and Workshop Safety

## Building Your Tool Collection
Starting with quality tools makes maintenance easier, safer, and more enjoyable. You don't need everything at once—build your collection gradually based on your needs and skills.

## Essential Starter Tools

### Hand Tools - The Foundation
- **Metric Socket Set**: 8mm-19mm, both shallow and deep sockets
- **Ratchet Handle**: 3/8" drive with comfortable grip
- **Extension Bars**: 3" and 6" for accessing tight spaces
- **Universal Joint**: For angled access
- **Hex Key Set**: 3mm-10mm, both L-shaped and T-handle styles
- **Screwdriver Set**: Phillips and flathead in various sizes
- **Pliers Set**: Needle nose, standard, and locking pliers

### Measuring Tools
- **Tire Pressure Gauge**: Digital preferred for accuracy
- **Torque Wrench**: 10-80 ft-lbs range covers most motorcycle applications
- **Feeler Gauges**: For valve clearances and gap measurements
- **Steel Rule**: 6" and 12" for precise measurements

### Specialty Motorcycle Tools
- **Chain Tools**: Master link pliers, chain breaker, alignment tool
- **Oil Filter Wrench**: Specific to your bike's filter size
- **Spark Plug Socket**: Usually 16mm or 18mm with rubber insert
- **Cable Luber**: For maintaining throttle and brake cables

## Tool Quality Considerations

### Buy Once Philosophy
- **Professional grade tools** last longer and work better
- **Harbor Freight** acceptable for occasional use tools
- **Snap-On, Craftsman, or SK** for frequently used items
- **Motorcycle-specific brands** like Motion Pro for specialty tools

### What to Avoid
- **Chrome sockets** on engine components (can slip)
- **Adjustable wrenches** on hex bolts (round off heads)
- **Cheap torque wrenches** (inaccurate readings)
- **Wrong drive sizes** (using 1/2" drive on small bolts)

## Workshop Setup and Safety

### Workspace Requirements
- **Level, solid surface**: Concrete floor ideal
- **Adequate lighting**: 100+ foot-candles minimum
- **Ventilation**: For fumes and dust removal
- **Storage**: Organized tool storage prevents loss and injury
- **Fire safety**: Extinguisher rated for electrical and chemical fires

### Motorcycle Securing
- **Center Stand**: Best stability for most maintenance
- **Rear Stand**: Necessary for wheel and chain work
- **Front Stand**: Required for front wheel maintenance
- **Tie-downs**: Secure bike when stands aren't available

### Personal Safety Equipment
- **Safety Glasses**: Always when grinding, cleaning, or working overhead
- **Work Gloves**: Cut-resistant when handling sharp parts
- **Chemical Gloves**: Nitrile when working with solvents or oils
- **Hearing Protection**: When using power tools
- **Appropriate Clothing**: No loose clothing near moving parts

## Understanding Torque Specifications

### Why Torque Matters
- **Under-torqued**: Bolts can loosen and fail
- **Over-torqued**: Threads strip or bolts break
- **Proper torque**: Ensures secure, reliable connections

### Using a Torque Wrench
1. **Set desired torque** on wrench scale
2. **Apply force smoothly** until wrench clicks
3. **Stop immediately** when click occurs
4. **Store at lowest setting** to maintain calibration

### Common Torque Specifications
- **Engine drain plug**: 25-30 ft-lbs typically
- **Oil filter**: Hand tight plus 3/4 turn
- **Wheel axles**: 50-80 ft-lbs (varies by bike)
- **Brake caliper bolts**: 25-35 ft-lbs
- **Always check your manual** for specific values

## Chemical Safety and Handling

### Common Chemicals
- **Engine Oil**: Mild irritant, dispose properly
- **Brake Cleaner**: Highly flammable, use in ventilated area
- **Chain Cleaner**: Often petroleum-based, avoid skin contact
- **Penetrating Oil**: Flammable, store safely
- **Coolant**: Toxic to pets, sweet taste is dangerous

### Safety Practices
- **Read all labels** before use
- **Work in ventilated areas** when using solvents
- **Keep fire sources away** from flammable materials
- **Wash hands thoroughly** after chemical contact
- **Eye wash station** or clean water readily available

## Tool Care and Maintenance

### Cleaning Tools
- **Remove dirt and oil** after each use
- **Light coat of oil** on steel tools prevents rust
- **Proper storage** in organized toolbox or chest
- **Regular inspection** for wear or damage

### Calibration
- **Torque wrenches** should be calibrated annually
- **Pressure gauges** can drift over time
- **Replace worn tools** before they cause damage

## Progressive Skill Building

### Start Simple
- **Basic maintenance**: Oil changes, tire pressure
- **Build confidence** with successful completions
- **Invest in better tools** as skills develop
- **Take on bigger jobs** gradually

### Learning Resources
- **Service manuals**: Bike-specific procedures
- **Online forums**: Community knowledge sharing
- **Local classes**: Community college or dealer training
- **Motorcycle shops**: Many offer classes or mentoring

### When to Stop
- **Safety first**: If you're not sure, get help
- **Expensive mistakes**: Some repairs cost more than professional work
- **Warranty concerns**: Some work must be dealer-performed
- **Time constraints**: Sometimes paying a pro is worth it

## Tool Storage and Organization

### Toolbox Selection
- **Size appropriately**: Room to grow but not wasteful
- **Quality drawers**: Smooth operation and secure locks
- **Portable options**: Roll-around for garage use
- **Organization systems**: Foam inserts or drawer dividers

### Inventory Management
- **Tool lists**: Know what you have and where it is
- **Regular audits**: Ensure nothing is missing
- **Replacement planning**: Budget for tool wear and upgrades
- **Loan tracking**: Know who has your tools

Remember: Good tools make difficult jobs easier and prevent frustration. Start with quality basics and build your collection based on actual needs. Safety should always be your first consideration—no repair is worth an injury.`
    },
    {
      title: 'Reading Manuals and Understanding Specifications',
      order: 6,
      glossary_terms: ['manual', 'specification', 'vin', 'torque'],
      content: `# Reading Manuals and Understanding Specifications

## Types of Motorcycle Documentation

### Owner's Manual
- **Basic operations**: Starting, controls, maintenance schedules
- **Specifications**: Fluids, tire pressures, capacities
- **Warranty information**: What's covered and for how long
- **Troubleshooting**: Common problems and solutions
- **Safety information**: Proper riding techniques and precautions

### Service Manual
- **Detailed procedures**: Step-by-step repair instructions
- **Torque specifications**: Exact values for all fasteners
- **Wiring diagrams**: Electrical system troubleshooting
- **Special tools**: Required equipment for specific jobs
- **Clearances and tolerances**: Precise measurement requirements

### Parts Manual
- **Exploded diagrams**: Visual parts identification
- **Part numbers**: Exact ordering information
- **Supersession information**: Updated part numbers
- **Application notes**: Which parts fit which model years

## Understanding VIN Decoding

### VIN Structure (17 characters)
1. **World Manufacturer**: First 3 characters identify manufacturer
2. **Vehicle Descriptor**: Characters 4-9 describe vehicle type
3. **Check Digit**: Character 10 validates VIN accuracy
4. **Model Year**: Character 11 indicates year
5. **Plant Code**: Character 12 shows manufacturing location
6. **Serial Number**: Characters 13-17 unique identifier

### Why VIN Matters
- **Correct parts ordering**: Ensures compatibility
- **Recall information**: Identifies affected vehicles
- **Insurance and registration**: Required for documentation
- **Theft prevention**: Unique identifier for recovery

## Specification Categories

### Engine Specifications
- **Displacement**: Engine size in cubic centimeters (cc)
- **Bore and Stroke**: Cylinder diameter and piston travel
- **Compression Ratio**: Relationship between cylinder volumes
- **Power Output**: Horsepower at specific RPM
- **Torque Output**: Twisting force at specific RPM
- **Redline**: Maximum safe engine speed

### Fluid Specifications
- **Engine Oil**: 
  - Viscosity (10W-40, 20W-50)
  - API rating (SJ, SL, SM)
  - Capacity (with and without filter)
- **Transmission Oil**: Often different from engine oil
- **Brake Fluid**: DOT 3, DOT 4, or DOT 5 specification
- **Coolant**: Type and mixture ratio

### Tire and Suspension Specifications
- **Tire Sizes**: Understanding the numbering system
  - 120/70-17: 120mm width, 70% aspect ratio, 17" rim
- **Pressure**: Front and rear specifications
- **Suspension Settings**: Preload, compression, rebound
- **Travel**: Amount of suspension movement

## Torque Specifications Deep Dive

### Understanding Torque Values
- **Foot-pounds (ft-lbs)**: American standard
- **Newton-meters (Nm)**: Metric standard
- **Conversion**: 1 ft-lb = 1.356 Nm

### Critical Torque Applications
- **Engine**: 
  - Drain plug: Usually 25-30 ft-lbs
  - Cylinder head: Follow specific sequence
  - Case bolts: Often 6-8 ft-lbs
- **Chassis**:
  - Axle nuts: 50-100+ ft-lbs
  - Brake calipers: 25-35 ft-lbs
  - Handlebar clamps: 15-20 ft-lbs

### Torque Sequences
Many bolts must be tightened in specific patterns:
- **Star pattern**: For even pressure distribution
- **Progressive tightening**: Multiple passes to final value
- **Thread locker**: When specified, always use correct type

## Maintenance Schedules

### Service Intervals
- **Time-based**: Every 6 months regardless of miles
- **Mileage-based**: Every 3,000 miles regardless of time
- **Whichever comes first**: Most common approach
- **Severe service**: More frequent intervals for harsh conditions

### Reading Service Charts
- **Initial service**: Often at 500-1,000 miles
- **Regular intervals**: Usually 3,000-6,000 mile cycles
- **Major services**: Often every 12,000-24,000 miles
- **Item-specific**: Some items have unique intervals

## Electrical Specifications

### Voltage and Amperage
- **System voltage**: Usually 12V for modern bikes
- **Battery capacity**: Measured in amp-hours (Ah)
- **Charging rate**: Generator/alternator output
- **Fuse ratings**: Critical for circuit protection

### Bulb Specifications
- **Headlight**: Usually H4 or LED equivalent
- **Turn signals**: 21W or LED equivalent
- **Tail/brake**: Dual filament or LED
- **Instruments**: Usually small LED or incandescent

## Using Technical Drawings

### Exploded Views
- **Part identification**: Numbers correspond to parts list
- **Assembly order**: Shows how parts fit together
- **Orientation**: Critical for proper installation
- **Hardware**: Shows bolts, washers, and fasteners

### Wiring Diagrams
- **Color codes**: Wire identification system
- **Connector types**: Different shapes prevent misconnection
- **Ground points**: Critical for proper function
- **Fuse locations**: Protection device placement

## Specification Tolerances

### Manufacturing Tolerances
- **Plus/minus values**: Acceptable range of measurements
- **Critical dimensions**: Often tighter tolerances
- **Wear limits**: When parts must be replaced
- **Service limits**: Maximum acceptable wear

### Measurement Tools
- **Calipers**: For precise external measurements
- **Micrometers**: For very precise measurements
- **Bore gauges**: For internal diameter measurements
- **Feeler gauges**: For gap measurements

## Troubleshooting Guides

### Symptom-Based Diagnosis
- **Engine problems**: Starting, running, power issues
- **Electrical issues**: Lights, charging, ignition
- **Chassis problems**: Handling, braking, suspension
- **Performance issues**: Poor fuel economy, reduced power

### Diagnostic Trees
- **Step-by-step process**: Logical problem-solving approach
- **Test procedures**: Specific measurements and checks
- **Probable causes**: Listed in order of likelihood
- **Corrective actions**: What to do for each problem

## Digital Resources

### Online Manuals
- **Manufacturer websites**: Often have downloadable PDFs
- **Subscription services**: Like AllData or Mitchell
- **Forum communities**: User-generated guides and tips
- **Video tutorials**: Visual learning supplements

### Mobile Apps
- **Torque specifications**: Quick reference apps
- **VIN decoders**: Instant vehicle information
- **Parts catalogs**: Interactive parts identification
- **Maintenance reminders**: Track service intervals

## Best Practices

### Manual Care
- **Protect from fluids**: Keep manuals clean and readable
- **Organize sections**: Bookmark frequently used pages
- **Make notes**: Add your own observations and tips
- **Multiple copies**: Digital backup for shop manual

### Specification Recording
- **Maintenance log**: Track what was done and when
- **Parts replacement**: Record part numbers and sources
- **Measurement records**: Track wear over time
- **Photo documentation**: Before and after pictures

Remember: Manuals are your most valuable tool. Take time to understand them thoroughly. When specifications seem unclear, always err on the side of caution and consult a professional. Proper interpretation of technical documentation is a skill that improves with practice and experience.`
    }
  ]
};

export const routineMaintenanceContent: CourseContent = {
  courseSlug: 'routine-maintenance-guide',
  lessons: [
    {
      title: 'Understanding Service Intervals',
      order: 1,
      glossary_terms: ['maintenance', 'service', 'interval'],
      content: `# Understanding Motorcycle Service Intervals

## Why Service Intervals Matter
Regular maintenance is the key to motorcycle longevity, safety, and performance. Unlike cars, motorcycles work harder and operate in more demanding conditions, requiring more frequent attention.

## Types of Service Intervals

### Time-Based Intervals
- **Monthly**: Basic checks regardless of usage
- **Seasonal**: Preparation for riding season changes
- **Annual**: Major service items and safety inspections
- **Storage**: Preparation for long-term storage

### Mileage-Based Intervals
- **500 miles**: Initial break-in service
- **3,000 miles**: Basic maintenance cycle
- **6,000 miles**: Intermediate service
- **12,000 miles**: Major service interval

### Condition-Based Maintenance
- **Visual inspection**: Check when problems are noticed
- **Performance changes**: Service when bike feels different
- **Environmental factors**: More frequent service in harsh conditions
- **Usage patterns**: Track hours vs. miles for accuracy

## Break-In Period (0-1,000 miles)

### Initial 500 Miles
- **Gentle operation**: Avoid full throttle and high RPM
- **Varying RPM**: Don't maintain constant speeds
- **Engine braking**: Use sparingly during break-in
- **First service**: Often most critical service

### 500-1,000 Miles  
- **Gradual increase**: Slowly expand operating range
- **Monitor closely**: Watch for leaks or unusual noises
- **Oil changes**: May need more frequent changes
- **Fastener check**: Bolts may loosen during break-in

### Break-In Service Items
- **Engine oil change**: Remove metal particles
- **Filter replacement**: Catch break-in debris
- **Valve clearance**: May need adjustment
- **Chain adjustment**: Sprockets and chain settle
- **Fastener torque**: Re-torque critical bolts

## Regular Maintenance Cycles

### Every Ride (Pre-Ride Check)
- **T-CLOCS inspection**: 5-minute safety check
- **Fluid levels**: Quick visual check
- **Tire pressure**: Weekly minimum, daily for touring
- **Lights and signals**: Ensure all function properly

### Weekly/500 Miles
- **Chain maintenance**: Clean and lubricate
- **Detailed inspection**: Look for developing problems
- **Fluid levels**: Check all reservoirs
- **Battery terminals**: Ensure clean and tight

### Monthly/1,000 Miles
- **Tire inspection**: Measure tread depth and pressure
- **Brake system**: Check pad wear and fluid level
- **Air filter**: Inspect and clean if needed
- **Cables**: Lubricate and adjust as needed

### Quarterly/3,000 Miles
- **Oil and filter change**: Most important maintenance item
- **Chain adjustment**: Maintain proper tension
- **Brake inspection**: Check pads, discs, and fluid
- **Spark plugs**: Inspect and clean or replace

### Annually/6,000-12,000 Miles
- **Major service**: Comprehensive inspection and service
- **Valve adjustment**: Critical for engine longevity
- **Suspension service**: Check for leaks and wear
- **Electrical system**: Test charging and battery

## Severe Service Conditions

### What Qualifies as Severe Service
- **Stop-and-go traffic**: Frequent idling and low speeds
- **Extreme temperatures**: Very hot or cold conditions
- **Dusty conditions**: Off-road or construction areas
- **Short trips**: Engine doesn't reach full operating temperature
- **High performance**: Track days or aggressive riding

### Adjusted Intervals for Severe Service
- **Oil changes**: Every 1,500-2,500 miles instead of 3,000
- **Air filter**: Clean every 1,000 miles, replace more frequently
- **Chain service**: Every 300-500 miles instead of 500-750
- **Brake inspection**: More frequent pad and fluid checks

## Manufacturer vs. Real-World Intervals

### Reading Between the Lines
- **Marketing influence**: Intervals may be extended for competitive advantage
- **Average conditions**: Specs assume ideal operating conditions
- **Warranty requirements**: Minimum intervals to maintain coverage
- **Real-world factors**: Actual conditions often require more frequent service

### Conservative Approach Benefits
- **Increased reliability**: Problems caught early
- **Better performance**: Well-maintained bikes run better
- **Higher resale value**: Maintenance records add value
- **Safety margin**: Reduced risk of component failure

## Creating Your Service Schedule

### Factors to Consider
- **Riding style**: Aggressive vs. conservative operation
- **Environment**: Urban vs. rural, climate conditions
- **Storage conditions**: Garage vs. outdoor parking
- **Usage patterns**: Daily commuter vs. weekend rider

### Tracking Methods
- **Maintenance log**: Written record of all service
- **Spreadsheet**: Digital tracking with reminders
- **Mobile apps**: Automated tracking and notifications
- **Service tags**: Visual reminders on the bike

### Sample Service Schedule Template

#### Every Ride
- [ ] Pre-ride inspection (T-CLOCS)
- [ ] Check for obvious problems

#### Weekly (or 300-500 miles)
- [ ] Chain lubrication
- [ ] Tire pressure check
- [ ] Quick fluid level check

#### Monthly (or 1,000 miles)
- [ ] Detailed inspection
- [ ] Chain cleaning and adjustment
- [ ] Air filter check
- [ ] Battery terminals

#### Every 3,000 Miles
- [ ] Oil and filter change
- [ ] Brake system inspection
- [ ] Spark plug service
- [ ] Drive belt/chain inspection

#### Every 6,000 Miles
- [ ] Valve clearance check
- [ ] Suspension inspection
- [ ] Electrical system test
- [ ] Major fastener torque check

## Seasonal Maintenance

### Spring Preparation
- **De-winterization**: Reverse storage procedures
- **Fluid changes**: Fresh oil, brake fluid, coolant
- **Battery service**: Charge and test capacity
- **Tire inspection**: Check for winter damage

### Summer Maintenance
- **Cooling system**: Ensure proper function for hot weather
- **Air filter**: Clean more frequently in dusty conditions
- **Chain maintenance**: Heat and dust require more attention
- **Hydration planning**: Rider safety in extreme heat

### Fall Preparation
- **Pre-winter service**: Prepare for reduced riding
- **Fluid condition**: Check for contamination
- **Electrical system**: Ensure charging system works
- **Storage planning**: Prepare for winterization

### Winter Storage
- **Stabilize fuel**: Prevent gum and varnish formation
- **Battery maintenance**: Remove or use tender
- **Tire care**: Avoid flat spots from sitting
- **Corrosion prevention**: Protect metal surfaces

## Record Keeping

### What to Track
- **Date and mileage**: When service was performed
- **Work performed**: Specific tasks completed
- **Parts used**: Part numbers and sources
- **Next service due**: Mileage or date reminder

### Documentation Benefits
- **Warranty claims**: Proof of proper maintenance
- **Resale value**: Shows bike was well cared for
- **Problem patterns**: Helps identify recurring issues
- **Budget planning**: Track maintenance costs

Remember: Consistent maintenance is more important than perfect intervals. It's better to service slightly early than to miss an interval. When in doubt, err on the side of caution and service more frequently rather than less.`
    },
    {
      title: 'Oil and Filter Changes',
      order: 2,
      glossary_terms: ['oil', 'filter', 'viscosity'],
      content: `# Motorcycle Oil and Filter Changes

## Understanding Engine Oil Functions

### Primary Functions
- **Lubrication**: Reduces friction between moving parts
- **Cooling**: Carries heat away from engine components
- **Cleaning**: Suspends dirt and combustion byproducts
- **Sealing**: Helps rings seal against cylinder walls
- **Protection**: Prevents corrosion and acid formation

### Why Motorcycles Are Different
- **Higher RPM**: Engines rev higher than car engines
- **Air cooling**: Oil carries more heat load
- **Wet clutch**: Oil lubricates clutch plates (most bikes)
- **Transmission**: Often shares oil with engine
- **Smaller capacity**: Less oil volume for same workload

## Oil Types and Specifications

### Oil Classifications
- **Conventional**: Refined from crude oil, least expensive
- **Synthetic Blend**: Mix of conventional and synthetic
- **Full Synthetic**: Engineered molecules, best performance
- **High Mileage**: Formulated for bikes with 50,000+ miles

### Viscosity Ratings
- **Single Grade**: 30W, 40W (rare in modern bikes)
- **Multi-Grade**: 10W-40, 20W-50 (most common)
- **First Number**: Cold weather flow (W = Winter)
- **Second Number**: Operating temperature thickness

### API Ratings
- **SJ**: Minimum for most modern bikes
- **SL/SM/SN**: Newer standards with better protection
- **JASO Ratings**: Japanese standard for wet clutch compatibility
  - **JASO MA**: For wet clutch motorcycles
  - **JASO MB**: For scooters with automatic transmissions

### Motorcycle-Specific Requirements
- **Wet Clutch Compatible**: No friction modifiers that cause clutch slip
- **Shear Stable**: Maintains viscosity under high stress
- **High Temperature**: Stable at engine operating temperatures
- **Low Foaming**: Maintains film strength under aeration

## Oil Change Intervals

### Manufacturer Recommendations
- **Conventional oil**: 3,000-4,000 miles typically
- **Synthetic blend**: 4,000-5,000 miles
- **Full synthetic**: 5,000-7,500 miles
- **Severe service**: Reduce intervals by 25-50%

### Factors Affecting Change Intervals
- **Riding conditions**: Stop-and-go vs. highway
- **Climate**: Extreme heat or cold
- **Oil quality**: Higher quality lasts longer
- **Engine condition**: Worn engines contaminate oil faster

### Oil Condition Indicators
- **Color**: Fresh oil is amber, used oil is dark brown/black
- **Consistency**: Should flow smoothly, not thick or gummy
- **Metal particles**: Visible contamination indicates problems
- **Smell**: Burnt smell indicates overheating

## Oil Filter Function and Types

### Filter Functions
- **Particle removal**: Captures metal particles and debris
- **Contaminant control**: Removes carbon and combustion byproducts
- **Flow regulation**: Maintains oil pressure throughout system
- **Bypass protection**: Allows flow if filter becomes clogged

### Filter Types
- **Spin-on**: Most common, easy to replace
- **Cartridge**: Filter element inside reusable housing
- **Screen**: Simple mesh filter, cleanable
- **Centrifugal**: Uses spinning action to separate contaminants

### Filter Selection Criteria
- **OEM specification**: Always meet or exceed original equipment
- **Micron rating**: How small particles it captures
- **Flow rate**: Must maintain adequate oil pressure
- **Bypass valve**: Opens if filter clogs to maintain flow

## Oil Change Procedure

### Preparation
1. **Warm engine**: Run for 2-3 minutes to thin oil
2. **Gather tools**: Drain pan, filter wrench, funnel, rags
3. **Safety first**: Ensure bike is stable and engine is warm but not hot
4. **Clean work area**: Prevent contamination

### Draining Old Oil
1. **Position drain pan**: Slightly off-center to catch initial flow
2. **Remove drain plug**: Use correct size socket, turn counterclockwise
3. **Let drain completely**: 10-15 minutes minimum
4. **Clean drain plug**: Remove old gasket, inspect threads

### Filter Replacement
1. **Locate filter**: Note position and access requirements
2. **Remove old filter**: Turn counterclockwise, expect oil spill
3. **Clean filter mounting**: Remove old gasket completely
4. **Install new filter**:
   - Apply thin coat of new oil to gasket
   - Hand tighten until gasket contacts surface
   - Additional 3/4 turn maximum

### Refilling with New Oil
1. **Reinstall drain plug**: New gasket, proper torque
2. **Add new oil**: Start with 75% of capacity
3. **Check level**: Use sight glass or dipstick
4. **Top off gradually**: Don't overfill
5. **Run engine**: Check for leaks, recheck level

## Common Mistakes and How to Avoid Them

### Overfilling
- **Problems**: Foaming, seal damage, poor performance
- **Prevention**: Add oil gradually, check level frequently
- **Correction**: Drain excess immediately

### Wrong Oil Type
- **Problems**: Clutch slip, poor protection, warranty void
- **Prevention**: Always check owner's manual specifications
- **Correction**: Change oil immediately with correct type

### Double-Gasket
- **Problems**: Massive oil leak, potential engine damage
- **Prevention**: Always remove old filter gasket
- **Correction**: Remove filter, clean surface, start over

### Over-Torquing Drain Plug
- **Problems**: Stripped threads, cracked oil pan
- **Prevention**: Use torque wrench, typical spec 25-30 ft-lbs
- **Correction**: Thread repair or oil pan replacement

## Disposal and Environmental Responsibility

### Used Oil Disposal
- **Auto parts stores**: Most accept used oil for recycling
- **Service stations**: Many have recycling programs
- **Municipal programs**: Check local waste management
- **Never dump**: Used oil is highly toxic to environment

### Filter Disposal
- **Drain completely**: Let filter drain for 24 hours
- **Metal recycling**: Most filters can be recycled
- **Hazardous waste**: Some areas classify as hazardous
- **Puncture and drain**: Required in some recycling programs

## Oil Analysis and Monitoring

### When to Consider Oil Analysis
- **High-value bikes**: Expensive engine replacement costs
- **Unknown history**: Used bike with unclear maintenance
- **Performance applications**: Track bikes or racing
- **Extended intervals**: When pushing oil change intervals

### What Oil Analysis Reveals
- **Wear metals**: Iron, aluminum, copper indicate component wear
- **Contamination**: Silicon (dirt), fuel dilution, coolant leaks
- **Oil condition**: Oxidation, viscosity breakdown, additive depletion
- **Trending**: Changes over time more important than single sample

## Troubleshooting Oil-Related Problems

### High Oil Consumption
- **Normal consumption**: Up to 1 quart per 2,000 miles acceptable
- **Possible causes**: Worn rings, valve seals, gaskets
- **Diagnosis**: Compression test, leak-down test
- **Solutions**: May require engine rebuild

### Oil Pressure Problems
- **Low pressure warning**: Stop immediately, check level
- **Possible causes**: Low oil, worn pump, clogged pickup
- **Diagnosis**: Mechanical gauge test
- **Solutions**: Range from oil change to engine rebuild

### Oil Leaks
- **Common sources**: Drain plug, filter, valve cover, crankcase
- **Diagnosis**: Clean engine, run, trace source of new leaks
- **Solutions**: Usually gasket or seal replacement

Remember: Oil is the lifeblood of your engine. Never skimp on quality or intervals. When in doubt, change it early rather than late. A $50 oil change is much cheaper than a $5,000 engine rebuild.`
    },
    {
      title: 'Brake System Inspection and Maintenance',
      order: 3,
      glossary_terms: ['brake', 'abs', 'pad', 'rotor'],
      content: `# Brake System Inspection and Maintenance

## Brake System Overview

### Why Brakes Are Critical
Brakes are your motorcycle's most important safety system. Unlike cars, motorcycles don't have safety cages or airbags—your brakes are often the difference between a close call and a serious accident.

### Types of Brake Systems
- **Disc Brakes**: Most common, superior stopping power
- **Drum Brakes**: Older technology, still found on some rear wheels
- **ABS Systems**: Anti-lock prevents wheel lockup
- **Combined/Linked**: Front and rear brakes work together

### Front vs. Rear Brake Distribution
- **Front brake**: Provides 70-80% of stopping power
- **Rear brake**: Provides 20-30% of stopping power
- **Weight transfer**: Braking shifts weight forward
- **Proper technique**: Use both brakes together

## Brake Fluid System

### Brake Fluid Functions
- **Force transmission**: Transfers lever pressure to brake pads
- **Heat absorption**: Handles extreme temperatures
- **Corrosion protection**: Prevents internal component damage
- **Lubrication**: Keeps moving parts operating smoothly

### Brake Fluid Types
- **DOT 3**: Glycol-based, absorbs moisture, lowest boiling point
- **DOT 4**: Higher boiling point than DOT 3, most common
- **DOT 5**: Silicone-based, doesn't absorb moisture, special applications
- **DOT 5.1**: Glycol-based, highest performance for street bikes

### Never Mix Fluid Types
- **DOT 3 and 4**: Can be mixed but use highest spec
- **DOT 5**: Never mix with glycol-based fluids
- **Contamination**: Any mixing can cause brake failure

## Brake Fluid Inspection and Service

### Checking Fluid Level
1. **Bike upright**: Use center stand or have assistant hold bike level
2. **Clean reservoir**: Remove dirt before opening cap
3. **Check level**: Should be between MIN and MAX marks
4. **Visual inspection**: Look for contamination or discoloration

### Fluid Condition Assessment
- **Fresh fluid**: Clear or light amber color
- **Contaminated**: Dark brown or black color
- **Moisture content**: Can be tested with special strips
- **Boiling point**: Decreases as moisture content increases

### Brake Fluid Change Procedure
1. **Clean reservoir area**: Prevent contamination
2. **Remove old fluid**: Use suction tool or turkey baster
3. **Refill with new fluid**: Use only specified type
4. **Bleed system**: Remove air bubbles
5. **Test operation**: Ensure firm lever feel

## Brake Pad Inspection

### Pad Wear Indicators
- **Thickness measurement**: Minimum 2-3mm pad material
- **Wear indicators**: Metal tabs that contact rotor
- **Visual inspection**: Look for uneven wear patterns
- **Squealing noise**: Often indicates pads need replacement

### Pad Wear Patterns
- **Even wear**: Normal operation, proper alignment
- **Tapered wear**: Possible caliper alignment issue
- **Outer pad only**: Sticking caliper piston
- **Glazed surface**: Overheating or poor quality pads

### When to Replace Pads
- **Thickness**: Less than 2mm material remaining
- **Noise**: Continuous squealing or grinding
- **Performance**: Reduced stopping power or longer lever travel
- **Visual damage**: Cracked, glazed, or contaminated pads

## Brake Rotor (Disc) Inspection

### Rotor Condition Checks
- **Thickness**: Measure with micrometer at multiple points
- **Warpage**: Check for runout with dial indicator
- **Surface condition**: Look for scoring, cracks, or heat damage
- **Edge condition**: Sharp edges indicate normal wear

### Rotor Problems
- **Warped rotors**: Cause pulsing feeling in brake lever
- **Scored rotors**: Deep grooves from worn pads or contamination
- **Cracked rotors**: Heat stress or age-related failure
- **Worn rotors**: Below minimum thickness specification

### Rotor Service Options
- **Resurfacing**: Light scoring can be machined out
- **Replacement**: Best option for safety and performance
- **Minimum thickness**: Never go below manufacturer specification
- **Replacement in pairs**: Both rotors should be same condition

## Brake Caliper Inspection

### Caliper Function
- **Piston movement**: Should move freely without binding
- **Pad alignment**: Ensures even contact with rotor
- **Seal integrity**: Prevents fluid leaks and contamination
- **Mounting security**: Proper torque prevents movement

### Common Caliper Problems
- **Sticking pistons**: Cause uneven pad wear
- **Leaking seals**: Result in fluid loss and air entry
- **Loose mounting**: Causes poor brake feel
- **Corrosion**: Internal damage from moisture contamination

### Caliper Maintenance
- **Cleaning**: Remove brake dust and road grime
- **Lubrication**: Use only brake-compatible lubricants
- **Seal inspection**: Look for leaks or deterioration
- **Piston movement**: Check for smooth operation

## Brake System Bleeding

### Why Bleeding Is Necessary
- **Air removal**: Air compresses, reducing brake effectiveness
- **Fluid replacement**: Removes contaminated fluid
- **System integrity**: Ensures proper hydraulic function
- **Safety**: Critical for reliable brake operation

### Bleeding Methods
- **Traditional**: Pump lever, open bleeder, repeat
- **Vacuum bleeding**: Uses vacuum pump to draw fluid
- **Pressure bleeding**: Forces fluid through system under pressure
- **Reverse bleeding**: Pushes fluid from caliper to reservoir

### Bleeding Procedure (Traditional Method)
1. **Fill reservoir**: Keep topped off throughout process
2. **Start at furthest caliper**: Usually rear brake
3. **Pump lever**: Build pressure, hold firmly
4. **Open bleeder screw**: 1/4 turn, watch for bubbles
5. **Close bleeder**: Before releasing lever
6. **Repeat**: Until no bubbles appear in fluid

## ABS System Considerations

### How ABS Works
- **Wheel speed sensors**: Monitor wheel rotation
- **Control module**: Processes sensor data
- **Hydraulic unit**: Modulates brake pressure
- **Feedback**: Prevents wheel lockup

### ABS Maintenance
- **Regular operation**: Test ABS function periodically
- **Sensor cleaning**: Keep wheel speed sensors clean
- **Fluid quality**: ABS systems sensitive to contamination
- **Professional service**: Complex system requires special tools

### ABS Troubleshooting
- **Warning lights**: Indicate system problems
- **Unusual operation**: Vibration or noise during activation
- **Reduced effectiveness**: May revert to non-ABS operation
- **Professional diagnosis**: Requires specialized equipment

## Brake Line and Hose Inspection

### What to Look For
- **Cracks or bulges**: Indicate internal deterioration
- **Leaks**: Wet spots or stains around fittings
- **Abrasion**: Wear from contact with other components
- **Age**: Rubber hoses should be replaced every 4-6 years

### Steel Braided Lines
- **Advantages**: Less expansion, better feel, longer life
- **Installation**: Requires careful routing and protection
- **Inspection**: Look for fraying of outer covering
- **Cost vs. benefit**: Performance improvement vs. expense

## Troubleshooting Common Brake Problems

### Spongy Brake Feel
- **Likely cause**: Air in brake lines
- **Solution**: Bleed brake system
- **Prevention**: Regular fluid changes

### Brake Lever to Handlebar
- **Likely cause**: Severely worn pads or fluid leak
- **Solution**: Immediate inspection and repair
- **Safety**: Do not ride until fixed

### Brake Drag
- **Likely cause**: Sticking caliper or wrong fluid type
- **Solution**: Caliper service or fluid change
- **Symptoms**: Hot brakes, reduced performance

### Pulsing Brake Feel
- **Likely cause**: Warped brake rotors
- **Solution**: Rotor replacement or resurfacing
- **Prevention**: Avoid overheating brakes

## Brake Maintenance Schedule

### Every Ride
- **Brake operation test**: Check before riding
- **Visual inspection**: Look for obvious problems
- **Lever feel**: Should be firm and consistent

### Monthly
- **Fluid level check**: Top off if needed
- **Pad inspection**: Visual check for wear
- **Line inspection**: Look for damage or leaks

### Every 6 Months
- **Detailed inspection**: Remove wheels for thorough check
- **Caliper cleaning**: Remove brake dust buildup
- **Rotor measurement**: Check thickness and runout

### Annually
- **Brake fluid change**: Essential for safety and performance
- **Complete system service**: Professional inspection recommended
- **Performance test**: Verify stopping distances and feel

Remember: Brakes are not an area to compromise. When in doubt, have them inspected by a professional. The cost of brake service is minimal compared to the cost of an accident caused by brake failure.`
    }
  ]
};

export const motorcycleSystemsContent: CourseContent = {
  courseSlug: 'motorcycle-systems-explained',
  lessons: [
    {
      title: 'Engine Systems and Combustion Basics',
      order: 1,
      glossary_terms: ['engine', 'combustion', 'piston', 'valve'],
      content: `# Motorcycle Engine Systems and Combustion

## Four-Stroke Engine Operation

### The Four Strokes Explained
Modern motorcycle engines primarily use the four-stroke cycle, also known as the Otto cycle. Understanding this process is fundamental to understanding how your motorcycle creates power.

#### Intake Stroke
- **Piston movement**: Moves down in cylinder
- **Intake valve**: Opens to allow fuel/air mixture in
- **Exhaust valve**: Remains closed
- **Result**: Creates vacuum that draws mixture into cylinder

#### Compression Stroke  
- **Piston movement**: Moves up in cylinder
- **Both valves**: Closed to seal cylinder
- **Mixture**: Compressed to 8:1 to 12:1 ratio typically
- **Result**: Increases temperature and pressure for better combustion

#### Power Stroke (Combustion)
- **Ignition**: Spark plug fires at precise moment
- **Explosion**: Rapid expansion of burning gases
- **Piston movement**: Forced down by expanding gases
- **Result**: Power transmitted through connecting rod to crankshaft

#### Exhaust Stroke
- **Piston movement**: Moves up in cylinder
- **Exhaust valve**: Opens to release burnt gases
- **Intake valve**: Remains closed
- **Result**: Pushes spent gases out through exhaust system

## Engine Configuration Types

### Single Cylinder
- **Characteristics**: Simple, lightweight, economical
- **Advantages**: Easy maintenance, good fuel economy
- **Disadvantages**: Vibration, limited power
- **Applications**: Entry-level bikes, dirt bikes, some cruisers
- **Examples**: Honda CRF250L, Yamaha XT250

### Parallel Twin
- **Configuration**: Two cylinders side by side
- **Firing order**: Usually 360° or 180° crankpin
- **Characteristics**: Good balance of power and smoothness
- **Applications**: Sport bikes, standards, adventure bikes
- **Examples**: Kawasaki Ninja 650, BMW F800GS

### V-Twin
- **Configuration**: Two cylinders in V formation (45°, 60°, or 90°)
- **Characteristics**: Distinctive sound, good torque
- **Advantages**: Compact, strong low-end power
- **Applications**: Cruisers, some sport bikes
- **Examples**: Harley-Davidson engines, Ducati Panigale

### Inline Four
- **Configuration**: Four cylinders in a row
- **Characteristics**: Smooth operation, high rev capability
- **Advantages**: High power output, refined operation
- **Applications**: Sport bikes, sport touring
- **Examples**: Yamaha YZF-R1, Honda CBR1000RR

### Triple (Inline Three)
- **Configuration**: Three cylinders in a row
- **Characteristics**: Unique sound, good power delivery
- **Balance**: Between twin torque and four-cylinder smoothness
- **Applications**: Sport bikes, standards, adventure
- **Examples**: Triumph Street Triple, Yamaha MT-09

## Engine Components Deep Dive

### Pistons and Connecting Rods
- **Piston function**: Transfers combustion force to crankshaft
- **Materials**: Aluminum alloy for light weight and heat dissipation
- **Piston rings**: Seal compression, control oil consumption
- **Connecting rod**: Links piston to crankshaft
- **Wrist pin**: Allows piston to pivot on connecting rod

### Valvetrain System
- **Intake valves**: Allow fuel/air mixture into cylinder
- **Exhaust valves**: Allow burnt gases to exit cylinder
- **Valve springs**: Return valves to closed position
- **Camshaft**: Opens and closes valves at precise timing
- **Rocker arms/tappets**: Transfer camshaft motion to valves

### Crankshaft and Flywheel
- **Crankshaft**: Converts linear piston motion to rotational motion
- **Counterweights**: Balance rotating and reciprocating forces
- **Main bearings**: Support crankshaft in engine cases
- **Flywheel**: Stores rotational energy, smooths power pulses
- **Primary drive**: Transfers power to transmission

## Valve Operation and Timing

### Valve Train Configurations
- **SOHC (Single Overhead Cam)**: One camshaft operates all valves
- **DOHC (Dual Overhead Cam)**: Separate cams for intake and exhaust
- **Desmodromic**: Positive valve closure (Ducati)
- **Pushrod**: Camshaft in engine block (mostly Harley-Davidson)

### Variable Valve Timing
- **Honda VTEC**: Changes cam profile at high RPM
- **BMW Vanos**: Continuously variable timing
- **Kawasaki VVT**: Variable valve timing system
- **Benefits**: Improved performance across RPM range

### Valve Clearance
- **Purpose**: Ensures complete valve closure when hot
- **Measurement**: Gap between valve stem and rocker/tappet
- **Adjustment**: Critical maintenance item
- **Symptoms of incorrect clearance**: Poor performance, noise, valve damage

## Combustion Chamber Design

### Compression Ratio
- **Definition**: Ratio of cylinder volume at BDC vs. TDC
- **Sport bikes**: Typically 11:1 to 13:1
- **Cruisers**: Usually 8:1 to 10:1
- **Higher compression**: More power but requires higher octane fuel
- **Lower compression**: Less power but more tolerant of poor fuel

### Combustion Chamber Shape
- **Hemispherical**: Allows larger valves, efficient combustion
- **Pentroof**: Good compromise of efficiency and packaging
- **Wedge**: Simple design, adequate performance
- **Bowl-in-piston**: Used with overhead cam engines

## Fuel Delivery Systems

### Carburetor Operation
- **Venturi effect**: Creates vacuum to draw fuel
- **Main jet**: Controls fuel flow at wide open throttle
- **Pilot jet**: Controls fuel flow at idle and low throttle
- **Needle**: Tapered metering rod for mid-range fuel flow
- **Float**: Maintains constant fuel level in bowl

### Fuel Injection Systems
- **Throttle body**: Controls airflow into engine
- **Fuel injectors**: Spray precisely metered fuel amounts
- **ECU (Engine Control Unit)**: Computer controls fuel delivery
- **Sensors**: Monitor engine conditions for optimal fuel mapping
- **Advantages**: Better fuel economy, emissions, cold starting

### Air Intake System
- **Air filter**: Removes contaminants from intake air
- **Intake tract**: Designed for optimal airflow
- **Velocity stacks**: Improve airflow into carburetors
- **Ram air**: Uses bike's forward motion to pressurize intake

## Cooling Systems

### Air Cooling
- **Heat dissipation**: Engine cases and cylinder heads finned
- **Advantages**: Simple, lightweight, no coolant to leak
- **Disadvantages**: Limited heat rejection, temperature variations
- **Applications**: Smaller engines, cruisers, some sport bikes

### Liquid Cooling
- **Radiator**: Heat exchanger that cools coolant
- **Water pump**: Circulates coolant through system
- **Thermostat**: Controls coolant flow for temperature regulation
- **Advantages**: Better temperature control, quieter operation
- **Applications**: High-performance engines, touring bikes

### Oil Cooling
- **Oil cooler**: Additional heat exchanger for engine oil
- **Function**: Supplements air or liquid cooling
- **Benefits**: Extends oil life, improves engine durability
- **Installation**: Often aftermarket addition

## Lubrication System

### Oil Pump Types
- **Gear pump**: Most common, positive displacement
- **Rotor pump**: Used in some high-performance engines
- **Dry sump**: Separate oil tank, used in racing applications
- **Wet sump**: Oil stored in engine cases (most common)

### Oil Flow Path
- **Pickup**: Draws oil from bottom of engine
- **Pump**: Creates pressure to circulate oil
- **Filter**: Removes contaminants from oil
- **Galleries**: Internal passages distribute oil
- **Return**: Oil drains back to sump by gravity

### Oil Functions in Motorcycles
- **Lubrication**: Reduces friction between moving parts
- **Cooling**: Carries heat away from engine components  
- **Cleaning**: Suspends contaminants for filtration
- **Sealing**: Helps rings seal against cylinder walls
- **Clutch operation**: Often lubricates wet clutch systems

## Engine Performance Factors

### Breathing Efficiency
- **Volumetric efficiency**: How well engine fills cylinders
- **Port design**: Affects airflow into and out of engine
- **Valve size**: Larger valves flow more air
- **Cam timing**: When valves open and close affects power

### Power vs. Torque
- **Horsepower**: Rate of doing work (torque × RPM ÷ 5252)
- **Torque**: Twisting force available at crankshaft
- **Power band**: RPM range where engine produces useful power
- **Riding characteristics**: Torque affects acceleration, HP affects top speed

### Engine Tuning Basics
- **Air/fuel ratio**: 14.7:1 is stoichiometric for gasoline
- **Rich mixture**: More fuel, cooler combustion, less power
- **Lean mixture**: Less fuel, hotter combustion, potential damage
- **Ignition timing**: When spark occurs affects power and efficiency

## Common Engine Problems

### Overheating
- **Causes**: Low coolant, blocked radiator, faulty thermostat
- **Symptoms**: Temperature gauge high, steam, reduced power
- **Prevention**: Regular cooling system maintenance
- **Solutions**: Address root cause, may require engine rebuild if severe

### Loss of Compression
- **Causes**: Worn rings, valve problems, head gasket failure
- **Symptoms**: Hard starting, poor performance, oil consumption
- **Diagnosis**: Compression test, leak-down test
- **Solutions**: May require top-end or complete engine rebuild

### Oil Consumption
- **Normal**: Up to 1 quart per 2,000 miles acceptable
- **Excessive**: Worn valve seals, rings, or gaskets
- **Symptoms**: Blue smoke, low oil level, fouled spark plugs
- **Solutions**: May require valve service or engine rebuild

Remember: Understanding how your engine works helps you maintain it properly and recognize problems early. Regular maintenance and quality fluids are the keys to long engine life.`
    }
  ]
};

// Create the placeholder lessons for all three priority courses
createCourseContent(motorcycleBasics101Content);
createCourseContent(routineMaintenanceContent);
createCourseContent(motorcycleSystemsContent);
