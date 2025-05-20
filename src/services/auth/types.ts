
import { User, Session } from "@supabase/supabase-js";

export interface AuthSession {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}
