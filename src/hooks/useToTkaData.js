import { useState, useEffect } from 'react';
import useToTkaStore from '../store/useToTkaStore';

// Caching layer outside component
const topicCache = new Map();
const chapterCache = new Map();

export function useTopic(subjectId, chapterId, topicId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId || !chapterId || !topicId) return;

    const cacheKey = `${subjectId}-${topicId}`;
    if (topicCache.has(cacheKey)) {
      setData(topicCache.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/data/normalized/${subjectId}/topics/${topicId}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Topic not found');
        return res.json();
      })
      .then(topicData => {
        topicCache.set(cacheKey, topicData);
        setData(topicData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [subjectId, chapterId, topicId]);

  return { data, loading, error };
}

export function useChapters(subjectId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subjectId) return;
    
    if (chapterCache.has(subjectId)) {
      setData(chapterCache.get(subjectId));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/data/normalized/${subjectId}/chapters.json`)
      .then(res => res.json())
      .then(chData => {
        chapterCache.set(subjectId, chData.chapters);
        setData(chData.chapters);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [subjectId]);

  return { data, loading };
}

export function useSubjects() {
  const { subjectsList, setSubjectsList } = useToTkaStore();
  const [loading, setLoading] = useState(!subjectsList);

  useEffect(() => {
    if (subjectsList) return;
    fetch(`/data/normalized/subjects.json`)
      .then(res => res.json())
      .then(data => {
        setSubjectsList(data);
        setLoading(false);
      });
  }, [subjectsList, setSubjectsList]);

  return { subjects: subjectsList, loading };
}
