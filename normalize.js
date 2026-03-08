import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'src', 'data');
const outDir = path.join(__dirname, 'public', 'data', 'normalized');

// Create output directories
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const subjectsList = [];

['mtk.json', 'bindo.json'].forEach(filename => {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return;

  const rawData = fs.readFileSync(filePath, 'utf-8');
  const subjectData = JSON.parse(rawData);
  const subjectKey = filename.replace('.json', '');
  
  const subjectOutDir = path.join(outDir, subjectKey);
  const topicsOutDir = path.join(subjectOutDir, 'topics');
  
  if (!fs.existsSync(subjectOutDir)) fs.mkdirSync(subjectOutDir, { recursive: true });
  if (!fs.existsSync(topicsOutDir)) fs.mkdirSync(topicsOutDir, { recursive: true });

  // Add to global subjects list
  subjectsList.push({
    id: subjectKey,
    subject: subjectData.subject,
    icon: subjectData.icon,
    description: subjectData.description,
    totalChapters: subjectData.chapters.length,
    totalTopics: subjectData.chapters.reduce((sum, ch) => sum + ch.topics.length, 0)
  });

  // Extract chapters and normalize topics
  const normalizedChapters = [];
  
  subjectData.chapters.forEach((chapter, cIdx) => {
    const chapterId = `c${cIdx + 1}`;
    const chapterTopics = [];
    
    chapter.topics.forEach((topic, tIdx) => {
      // 1. Create a unique topic ID
      const topicId = `t${cIdx + 1}_${tIdx + 1}`;
      
      // 2. Add minimal info to chapter's topic list
      chapterTopics.push({
        id: topicId,
        title: topic.title
      });
      
      // 3. Save full topic content as separate JSON
      const fullTopicContent = {
        id: topicId,
        chapterId: chapterId,
        subjectId: subjectKey,
        title: topic.title,
        content: topic.content,
        illustration: topic.illustration,
        formulas: topic.formulas || [],
        keyPoints: topic.keyPoints || [],
        examples: topic.examples || [],
        tips: topic.tips || [],
        quiz: topic.quiz || []
      };
      
      fs.writeFileSync(
        path.join(topicsOutDir, `${topicId}.json`),
        JSON.stringify(fullTopicContent, null, 2)
      );
    });
    
    normalizedChapters.push({
      id: chapterId,
      title: chapter.title,
      topics: chapterTopics
    });
  });
  
  // Save chapters structure for this subject
  fs.writeFileSync(
    path.join(subjectOutDir, 'chapters.json'),
    JSON.stringify({ chapters: normalizedChapters }, null, 2)
  );
});

// Save subjects list
fs.writeFileSync(
  path.join(outDir, 'subjects.json'),
  JSON.stringify(subjectsList, null, 2)
);

console.log('Normalization complete! Normalized data written to public/data/normalized/');
