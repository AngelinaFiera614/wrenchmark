
import { supabase } from "@/integrations/supabase/client";

export interface LessonAnalyticsEvent {
  id: string;
  lesson_id: string;
  user_id?: string;
  event_type: 'view' | 'start' | 'complete' | 'quiz_attempt' | 'block_interaction';
  event_data?: Record<string, any>;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export async function trackLessonEvent(event: {
  lesson_id: string;
  event_type: string;
  event_data?: Record<string, any>;
  session_id?: string;
}): Promise<void> {
  const { error } = await supabase
    .from('lesson_analytics')
    .insert({
      ...event,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });

  if (error) {
    console.error('Error tracking lesson event:', error);
    // Don't throw - analytics shouldn't break the user experience
  }
}

export async function getLessonAnalytics(
  lessonId: string,
  eventType?: string,
  dateRange?: { start: string; end: string }
): Promise<LessonAnalyticsEvent[]> {
  let query = supabase
    .from('lesson_analytics')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('created_at', { ascending: false });

  if (eventType) {
    query = query.eq('event_type', eventType);
  }

  if (dateRange) {
    query = query
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching lesson analytics:', error);
    throw error;
  }

  return data || [];
}

export async function getLessonStats(lessonId: string): Promise<{
  total_views: number;
  total_completions: number;
  completion_rate: number;
  average_time_spent: number;
}> {
  const { data, error } = await supabase
    .from('lesson_analytics')
    .select('event_type, event_data')
    .eq('lesson_id', lessonId);

  if (error) {
    console.error('Error fetching lesson stats:', error);
    throw error;
  }

  const events = data || [];
  const views = events.filter(e => e.event_type === 'view').length;
  const completions = events.filter(e => e.event_type === 'complete').length;
  
  return {
    total_views: views,
    total_completions: completions,
    completion_rate: views > 0 ? (completions / views) * 100 : 0,
    average_time_spent: 0 // Would need to calculate from start/complete events
  };
}
