
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Read the SQL file
const sqlContent = fs.readFileSync(
  path.join(__dirname, '20250519_manual_tag_function.sql'),
  'utf8'
)

async function runMigration() {
  // Get Supabase URL and key from environment variables
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or service key')
    process.exit(1)
  }

  // Create a Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Run the SQL migration
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: sqlContent
    })

    if (error) {
      console.error('Migration failed:', error)
      process.exit(1)
    }

    console.log('Migration successful!')
  } catch (error) {
    console.error('Error running migration:', error)
    process.exit(1)
  }
}

runMigration()
