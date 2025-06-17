
import { supabase } from '@/integrations/supabase/client';

export interface APITestResult {
  endpoint: string;
  method: string;
  status: 'passed' | 'failed' | 'warning';
  responseTime: number;
  error?: string;
  details?: any;
}

export interface APITestSuite {
  name: string;
  tests: APITestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageResponseTime: number;
}

export async function runAPITestSuite(): Promise<APITestSuite[]> {
  const testSuites: APITestSuite[] = [];

  // Test Motorcycle API endpoints
  const motorcycleTests = await testMotorcycleAPI();
  testSuites.push(motorcycleTests);

  // Test Brand API endpoints
  const brandTests = await testBrandAPI();
  testSuites.push(brandTests);

  // Test Component API endpoints
  const componentTests = await testComponentAPI();
  testSuites.push(componentTests);

  // Test Authentication API
  const authTests = await testAuthAPI();
  testSuites.push(authTests);

  return testSuites;
}

async function testMotorcycleAPI(): Promise<APITestSuite> {
  const tests: APITestResult[] = [];

  // Test: Fetch all motorcycles
  const fetchAllTest = await testAPIEndpoint(
    'motorcycle_models',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(fetchAllTest);

  // Test: Fetch motorcycle with relationships
  const fetchWithRelsTest = await testAPIEndpoint(
    'motorcycle_models (with relationships)',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select(`
          *,
          brands(name),
          model_years(year, model_configurations(*))
        `)
        .limit(5);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(fetchWithRelsTest);

  // Test: Search motorcycles
  const searchTest = await testAPIEndpoint(
    'motorcycle_models (search)',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select('*')
        .ilike('name', '%honda%')
        .limit(5);
      
      if (error) throw new Error(error.message);
      return { data, searchResults: data?.length || 0 };
    }
  );
  tests.push(searchTest);

  // Test: Filter by draft status
  const filterTest = await testAPIEndpoint(
    'motorcycle_models (filter drafts)',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('motorcycle_models')
        .select('*')
        .eq('is_draft', false)
        .limit(5);
      
      if (error) throw new Error(error.message);
      return { data, publishedCount: data?.length || 0 };
    }
  );
  tests.push(filterTest);

  return calculateTestSuiteStats('Motorcycle API', tests);
}

async function testBrandAPI(): Promise<APITestSuite> {
  const tests: APITestResult[] = [];

  // Test: Fetch all brands
  const fetchAllTest = await testAPIEndpoint(
    'brands',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(fetchAllTest);

  // Test: Fetch brands with motorcycle count
  const brandCountTest = await testAPIEndpoint(
    'brands (with motorcycle count)',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('brands')
        .select(`
          *,
          motorcycle_models(count)
        `)
        .limit(5);
      
      if (error) throw new Error(error.message);
      return { data, brandsWithModels: data?.length || 0 };
    }
  );
  tests.push(brandCountTest);

  // Test: Search brands
  const searchTest = await testAPIEndpoint(
    'brands (search)',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .ilike('name', '%yamaha%')
        .limit(5);
      
      if (error) throw new Error(error.message);
      return { data, searchResults: data?.length || 0 };
    }
  );
  tests.push(searchTest);

  return calculateTestSuiteStats('Brand API', tests);
}

async function testComponentAPI(): Promise<APITestSuite> {
  const tests: APITestResult[] = [];

  // Test: Fetch engines
  const enginesTest = await testAPIEndpoint(
    'engines',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('engines')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(enginesTest);

  // Test: Fetch brake systems
  const brakesTest = await testAPIEndpoint(
    'brake_systems',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('brake_systems')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(brakesTest);

  // Test: Fetch component assignments
  const assignmentsTest = await testAPIEndpoint(
    'model_component_assignments',
    'SELECT',
    async () => {
      const { data, error } = await supabase
        .from('model_component_assignments')
        .select('*')
        .limit(10);
      
      if (error) throw new Error(error.message);
      return { data, count: data?.length || 0 };
    }
  );
  tests.push(assignmentsTest);

  return calculateTestSuiteStats('Component API', tests);
}

async function testAuthAPI(): Promise<APITestSuite> {
  const tests: APITestResult[] = [];

  // Test: Get current user
  const userTest = await testAPIEndpoint(
    'auth.getUser()',
    'AUTH',
    async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (error) throw new Error(error.message);
      return { user: data.user, isAuthenticated: !!data.user };
    }
  );
  tests.push(userTest);

  // Test: Get session
  const sessionTest = await testAPIEndpoint(
    'auth.getSession()',
    'AUTH',
    async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) throw new Error(error.message);
      return { session: data.session, hasSession: !!data.session };
    }
  );
  tests.push(sessionTest);

  // Test: Fetch user profile
  const profileTest = await testAPIEndpoint(
    'profiles (current user)',
    'SELECT',
    async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.user.id)
        .single();
      
      if (error) throw new Error(error.message);
      return { profile: data, isAdmin: data?.is_admin };
    }
  );
  tests.push(profileTest);

  return calculateTestSuiteStats('Authentication API', tests);
}

async function testAPIEndpoint(
  endpoint: string,
  method: string,
  testFunction: () => Promise<any>
): Promise<APITestResult> {
  const startTime = performance.now();
  
  try {
    const result = await testFunction();
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    return {
      endpoint,
      method,
      status: 'passed',
      responseTime,
      details: result
    };
  } catch (error) {
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    return {
      endpoint,
      method,
      status: 'failed',
      responseTime,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function calculateTestSuiteStats(name: string, tests: APITestResult[]): APITestSuite {
  const totalTests = tests.length;
  const passedTests = tests.filter(t => t.status === 'passed').length;
  const failedTests = tests.filter(t => t.status === 'failed').length;
  const averageResponseTime = Math.round(
    tests.reduce((sum, test) => sum + test.responseTime, 0) / totalTests
  );

  return {
    name,
    tests,
    totalTests,
    passedTests,
    failedTests,
    averageResponseTime
  };
}

export async function testDatabasePerformance(): Promise<{
  queryPerformance: { query: string; time: number }[];
  connectionStatus: 'healthy' | 'slow' | 'failed';
  averageResponseTime: number;
}> {
  const queries = [
    {
      name: 'Simple count',
      query: () => supabase.from('motorcycle_models').select('*', { count: 'exact', head: true })
    },
    {
      name: 'Complex join',
      query: () => supabase
        .from('motorcycle_models')
        .select(`
          *,
          brands(name),
          model_years(
            year,
            model_configurations(name)
          )
        `)
        .limit(5)
    },
    {
      name: 'Search query',
      query: () => supabase
        .from('motorcycle_models')
        .select('*')
        .ilike('name', '%honda%')
        .limit(10)
    },
    {
      name: 'Filter and sort',
      query: () => supabase
        .from('motorcycle_models')
        .select('*')
        .eq('is_draft', false)
        .order('name')
        .limit(10)
    }
  ];

  const queryPerformance: { query: string; time: number }[] = [];
  
  for (const { name, query } of queries) {
    const startTime = performance.now();
    try {
      await query();
      const endTime = performance.now();
      queryPerformance.push({
        query: name,
        time: Math.round(endTime - startTime)
      });
    } catch (error) {
      queryPerformance.push({
        query: name,
        time: -1 // Indicates failure
      });
    }
  }

  const validTimes = queryPerformance.filter(q => q.time > 0).map(q => q.time);
  const averageResponseTime = validTimes.length > 0 
    ? Math.round(validTimes.reduce((sum, time) => sum + time, 0) / validTimes.length)
    : 0;

  let connectionStatus: 'healthy' | 'slow' | 'failed' = 'healthy';
  if (validTimes.length === 0) {
    connectionStatus = 'failed';
  } else if (averageResponseTime > 1000) {
    connectionStatus = 'slow';
  }

  return {
    queryPerformance,
    connectionStatus,
    averageResponseTime
  };
}
