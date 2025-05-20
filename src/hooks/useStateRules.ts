
import { useState, useEffect } from "react";
import { getAllStateRules, getStateRuleByCode, getStateRulesForLesson } from "@/services/stateRulesService";
import { StateRule } from "@/types/state";

/**
 * Hook for fetching all state rules
 */
export function useAllStateRules() {
  const [states, setStates] = useState<StateRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllStateRules();
        setStates(data);
      } catch (err: any) {
        console.error("Error in useAllStateRules:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, isLoading, error };
}

/**
 * Hook for fetching a specific state by code
 */
export function useStateByCode(stateCode: string | undefined) {
  const [state, setState] = useState<StateRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!stateCode) {
      setState(null);
      return;
    }

    const fetchState = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getStateRuleByCode(stateCode);
        setState(data);
      } catch (err: any) {
        console.error("Error in useStateByCode:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, [stateCode]);

  return { state, isLoading, error };
}

/**
 * Hook for fetching state rules related to a lesson
 */
export function useLessonStateRules(lessonId: string | undefined) {
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setStateRules([]);
      return;
    }

    const fetchStateRules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getStateRulesForLesson(lessonId);
        setStateRules(data);
      } catch (err: any) {
        console.error("Error in useLessonStateRules:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStateRules();
  }, [lessonId]);

  return { stateRules, isLoading, error };
}
