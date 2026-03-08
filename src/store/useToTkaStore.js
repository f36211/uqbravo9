import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useToTkaStore = create(
  persist(
    (set, get) => ({
      // User Preferences
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      recentSearches: [],
      addRecentSearch: (query) => set((state) => {
        const filtered = state.recentSearches.filter(q => q !== query);
        return { recentSearches: [query, ...filtered].slice(0, 5) };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),

      // Progress Tracker
      completedTopics: [], // array of topicIds
      markTopicCompleted: (topicId) => set((state) => {
        if (!state.completedTopics.includes(topicId)) {
          return { completedTopics: [...state.completedTopics, topicId] };
        }
        return state;
      }),
      
      // Mistake Tracker (Smart Review)
      mistakes: {}, // { topicId: { quizId: count } }
      recordMistake: (topicId, quizIdx) => set((state) => {
        const topicMistakes = state.mistakes[topicId] || {};
        const count = (topicMistakes[quizIdx] || 0) + 1;
        return {
          mistakes: {
            ...state.mistakes,
            [topicId]: {
              ...topicMistakes,
              [quizIdx]: count
            }
          }
        };
      }),
      
      // Step-by-Step State Storage
      stepProgress: {}, // { exampleId: currentStepIndex }
      updateStepProgress: (exampleId, stepIndex) => set((state) => ({
        stepProgress: {
          ...state.stepProgress,
          [exampleId]: stepIndex
        }
      })),
      
      // Subjects Data (Cached)
      subjectsList: null,
      setSubjectsList: (data) => set({ subjectsList: data })
    }),
    {
      name: 'totka-storage',
      partialize: (state) => ({ 
        darkMode: state.darkMode, 
        recentSearches: state.recentSearches,
        completedTopics: state.completedTopics,
        mistakes: state.mistakes,
        stepProgress: state.stepProgress
      }),
    }
  )
);

export default useToTkaStore;
