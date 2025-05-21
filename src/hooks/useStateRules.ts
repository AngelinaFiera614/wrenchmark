
import { useState, useEffect } from 'react';
import { StateRule } from '@/types/state';
import { getAllStateRules, getStateRuleByCode, getStateRulesForLesson } from '@/services/stateRulesService';

// Hook to fetch all state rules
export const useAllStateRules = () => {
  const [states, setStates] = useState<StateRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStates = async () => {
      setIsLoading(true);
      try {
        const stateRules = await getAllStateRules();
        setStates(stateRules);
      } catch (err) {
        console.error("Error fetching state rules:", err);
        setError("Failed to load states");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStates();
  }, []);

  return { states, isLoading, error };
};

// Hook to fetch state rule by code
export const useStateByCode = (stateCode?: string) => {
  const [state, setState] = useState<StateRule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateCode) {
      setState(null);
      return;
    }

    const fetchState = async () => {
      setIsLoading(true);
      try {
        const stateRule = await getStateRuleByCode(stateCode);
        setState(stateRule);
      } catch (err) {
        console.error(`Error fetching state with code ${stateCode}:`, err);
        setError("Failed to load state information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, [stateCode]);

  return { state, isLoading, error };
};

// Hook to fetch lesson-specific state rules
export const useLessonStateRules = (lessonId?: string) => {
  const [stateRules, setStateRules] = useState<StateRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) {
      setStateRules([]);
      return;
    }

    const fetchStateRules = async () => {
      setIsLoading(true);
      try {
        const rules = await getStateRulesForLesson(lessonId);
        setStateRules(rules);
      } catch (err) {
        console.error("Error fetching state rules for lesson:", err);
        setError("Failed to load state rules");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStateRules();
  }, [lessonId]);

  return { stateRules, isLoading, error };
};
