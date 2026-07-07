import { performance } from 'perf_hooks';

// Simulate 10,000 chapters with a lot of text
const chapters = Array.from({ length: 10000 }, (_, i) => ({
  id: `chapter-${i}`,
  title: `Chapter ${i}: The Quick Brown Fox Jumps Over The Lazy Dog. This is a very long title to make the string allocation more noticeable during the benchmark runs for our optimizations.`,
  content: `<p>This is the content of chapter ${i}. It has some <b>HTML</b> tags and a lot of text. The quick brown fox jumps over the lazy dog again and again. Here is the word we are looking for: query_string. Let's add some more text so that string allocations are heavier and more noticeable in the profile. Padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding padding.</p>`
}));

function searchUnoptimized(query: string) {
  const lowerQuery = query.toLowerCase();
  const results: any[] = [];

  chapters.forEach(chapter => {
    // Search in title
    if (chapter.title.toLowerCase().includes(lowerQuery)) {
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: "title",
        snippet: chapter.title,
        index: chapter.title.toLowerCase().indexOf(lowerQuery),
      });
    }

    // Search in content (strip HTML tags first for cleaner search)
    const plainContent = chapter.content
      ? chapter.content.replace(/<[^>]+>/g, "")
      : "";

    // Simulate what the unoptimized code in the prompt was doing (if plainContent is reverted)
    if (plainContent.toLowerCase().includes(lowerQuery)) {
      const index = plainContent.toLowerCase().indexOf(lowerQuery);
      const start = Math.max(0, index - 40);
      const end = Math.min(plainContent.length, index + query.length + 40);
      let snippet = plainContent.substring(start, end);

      if (start > 0) snippet = "..." + snippet;
      if (end < plainContent.length) snippet = snippet + "...";

      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: "content",
        snippet,
        index,
      });
    }
  });
  return results;
}

function searchOptimized(query: string) {
  const lowerQuery = query.toLowerCase();
  const results: any[] = [];

  chapters.forEach(chapter => {
    // Search in title
    const lowerTitle = chapter.title.toLowerCase();
    const titleIndex = lowerTitle.indexOf(lowerQuery);
    if (titleIndex !== -1) {
      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: "title",
        snippet: chapter.title,
        index: titleIndex,
      });
    }

    // Search in content (strip HTML tags first for cleaner search)
    const plainContent = chapter.content
      ? chapter.content.replace(/<[^>]+>/g, "")
      : "";

    const lowerPlainContent = plainContent.toLowerCase();
    const index = lowerPlainContent.indexOf(lowerQuery);

    if (index !== -1) {
      const start = Math.max(0, index - 40);
      const end = Math.min(plainContent.length, index + query.length + 40);
      let snippet = plainContent.substring(start, end);

      if (start > 0) snippet = "..." + snippet;
      if (end < plainContent.length) snippet = snippet + "...";

      results.push({
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        type: "content",
        snippet,
        index,
      });
    }
  });
  return results;
}

const query = "query_string";

// Warmup
for (let i = 0; i < 10; i++) {
  searchUnoptimized(query);
  searchOptimized(query);
}

let start = performance.now();
for (let i = 0; i < 100; i++) {
  searchUnoptimized(query);
}
let end = performance.now();
console.log(`Unoptimized: ${(end - start).toFixed(2)} ms`);

start = performance.now();
for (let i = 0; i < 100; i++) {
  searchOptimized(query);
}
end = performance.now();
console.log(`Optimized: ${(end - start).toFixed(2)} ms`);
