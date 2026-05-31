const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'General', 'AI', 'Algorithms', 'Android', 'Angular', 'Architecture',
      'Assignment', 'AWS', 'Azure', 'Best Practices', 'Blockchain',
      'C#', 'C++', 'Career', 'CI/CD', 'CSS',
      'Dart', 'Data Science', 'Database', 'Deep Learning', 'Deno',
      'Design', 'DevOps', 'Django', 'Docker', 'Express',
      'Flask', 'Flutter', 'GCP', 'Go', 'GraphQL',
      'HTML', 'IoT', 'Interview', 'Java', 'JavaScript',
      'Kotlin', 'Kubernetes', 'Linux', 'LLM', 'Lua',
      'Machine Learning', 'Mobile', 'MongoDB', 'MySQL', 'NLP',
      'Networking', 'Next.js', 'Node.js', 'Nuxt', 'Open Source',
      'Opinion', 'Performance', 'PHP', 'PostgreSQL', 'Project',
      'Prompt Engineering', 'Python', 'React', 'React Native', 'Redis',
      'Research', 'Review', 'Ruby', 'Rust', 'Security',
      'Spring Boot', 'SQLite', 'Svelte', 'Swift', 'System Design',
      'Testing', 'Tutorial', 'TypeScript', 'UI/UX', 'Vue',
      'Web Dev',
    ],
  },
  imageUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
