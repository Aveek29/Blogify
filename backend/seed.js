const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const User = require('./models/User');

dotenv.config();

const SEED_USER = {
  username: 'demo_author',
  email: 'demo@blogify.dev',
  password: 'Demo123!',
};

const CATEGORIES = [
  'General', 'JavaScript', 'React', 'Python', 'Node.js', 'AI',
  'CSS', 'TypeScript', 'DevOps', 'Tutorial', 'Database', 'Security',
  'Machine Learning', 'Docker', 'Go', 'Rust', 'Vue', 'Angular',
  'Design', 'Career', 'Open Source', 'Testing', 'Performance',
  'Web Dev', 'Mobile',
];

const TITLES = [
  'Getting Started with React 19',
  'Understanding JavaScript Closures',
  'Building REST APIs with Express',
  'Python for Data Science',
  'Docker Compose in Production',
  'The State of AI in 2024',
  'CSS Grid vs Flexbox',
  'TypeScript 5.5 New Features',
  'Node.js Streams Deep Dive',
  'Introduction to Machine Learning',
  'Kubernetes for Developers',
  'React Server Components Explained',
  'Building Scalable APIs with GraphQL',
  'Complete Guide to MongoDB Aggregation',
  'Web Security Best Practices',
  'Understanding OAuth 2.0 and JWT',
  'Rust vs Go Which One to Learn',
  'CI/CD Pipelines with GitHub Actions',
  'Database Design Patterns',
  'Microservices Architecture Pros and Cons',
  'Building Real-time Apps with WebSockets',
  'The Art of Code Review',
  'Performance Optimization Tips',
  'Introduction to WebAssembly',
  'Testing React Components with Vitest',
  'Understanding the Event Loop',
  'CSS Animations and Transitions',
  'Building CLI Tools with Node.js',
  'Deep Dive into Promises and Async Await',
  'API Design Principles',
  'System Design Interview Prep',
  'Introduction to Redis Caching',
  'Building with Next.js 14',
  'Responsive Design Techniques',
  'State Management in React',
  'Understanding HTTP2 and HTTP3',
  'PostgreSQL vs MongoDB',
  'Building Chrome Extensions',
  'Fundamentals of UI UX Design',
  'Introduction to Deno',
  'Working with Web Workers',
  'Serverless Architecture Guide',
  'Building Desktop Apps with Tauri',
  'GraphQL Subscriptions for Real-time Data',
  'Advanced TypeScript Patterns',
  'Containerization Best Practices',
  'The Future of Web Development',
  'Building Accessible Web Applications',
  'Introduction to Edge Computing',
  'Data Structures Every Developer Should Know',
  'Monorepo Management with Turborepo',
  'API Versioning Strategies',
  'Building with Prisma ORM',
  'Error Handling Patterns in Node.js',
  'Authentication Strategies in Modern Web Apps',
];

const CONTENTS = [
  `In this comprehensive guide, we explore the foundational concepts that every developer needs to master. Whether you are just starting out or looking to deepen your understanding, this article has something valuable for you.

We begin with the basics and gradually build up to more advanced topics, ensuring that you have a solid understanding at each step before moving forward.

Key topics covered in this article include practical examples, real-world use cases, and common pitfalls to avoid. By the end, you will have the confidence to apply these concepts in your own projects.`,

  `The web development landscape evolves rapidly, and staying current is essential for any serious developer. This article breaks down the most important trends and technologies shaping the industry today.

From modern JavaScript frameworks to cloud-native architectures, we cover the tools and practices that will define the next generation of web applications.

Whether you are building a simple blog or a complex enterprise application, the principles discussed here will help you make better architectural decisions and write more maintainable code.`,

  `Performance is not just a feature — it is a fundamental aspect of good software engineering. In this article, we dive deep into optimization techniques that can dramatically improve your application's speed and responsiveness.

We cover everything from frontend bundle optimization to backend query tuning, with practical benchmarks and before-after comparisons. These techniques have been battle-tested in production environments.

Remember that premature optimization is the root of all evil, but ignoring performance until it becomes a crisis is equally problematic. This guide helps you find the right balance.`,

  `Security should never be an afterthought. This article walks through the most common vulnerabilities found in web applications and, more importantly, how to defend against them.

Topics include XSS prevention, CSRF protection, SQL injection prevention, secure authentication flows, and proper session management. Each section includes code examples showing both vulnerable and secure implementations.

By following the practices outlined here, you can significantly reduce the attack surface of your applications and protect your users' data.`,

  `Testing is not just about catching bugs — it is about building confidence in your codebase. This article explores different testing strategies and how to implement them effectively.

From unit tests to integration tests and end-to-end testing, we discuss the trade-offs involved in each approach and provide guidance on building a balanced testing strategy that maximizes coverage while minimizing maintenance overhead.

We also cover modern testing tools and frameworks, showing you how to set up a robust testing pipeline that integrates seamlessly with your CI/CD workflow.`,

  `Scalability is a common challenge that many applications face as they grow. This article examines architectural patterns and infrastructure decisions that enable applications to handle increasing load gracefully.

Topics include horizontal vs vertical scaling, database sharding strategies, caching layers, message queues, and load balancing. Each concept is illustrated with real-world examples and architecture diagrams.

Whether you are planning for growth or troubleshooting performance issues, the patterns discussed here provide a solid foundation for building scalable systems.`,

  `The developer experience is often overlooked in favor of end-user experience, but it is equally important. This article explores tools, workflows, and practices that can make your development process smoother and more enjoyable.

From efficient debugging techniques to automated code quality tools, we cover practical tips that will save you time and reduce frustration. A good developer experience leads to better code and happier teams.

We also discuss how to set up your development environment for maximum productivity, including editor configurations, custom scripts, and useful command-line tools that every developer should know.`,

  `Open source software powers the modern internet. This article provides a practical guide to contributing to open source projects, from finding your first issue to getting your first pull request merged.

We discuss how to read and understand large codebases, communicate effectively with maintainers, write good commit messages, and navigate the social aspects of open source collaboration.

Contributing to open source is one of the best ways to improve your skills, build your portfolio, and connect with the global developer community. This guide will help you get started with confidence.`,

  `Command-line tools are an essential part of every developer's toolkit. This article teaches you how to build your own CLI tools using Node.js, from simple scripts to full-featured command-line applications.

We cover argument parsing, user input handling, colorful output, progress bars, configuration files, and distribution strategies. Each concept is demonstrated with practical, reusable examples.

Building CLI tools is a valuable skill that can automate repetitive tasks, improve your workflow, and even become useful open source projects that others can benefit from.`,

  `Database design is a critical skill that separates good applications from great ones. This article covers the fundamental principles of database design, including normalization, indexing strategies, query optimization, and data modeling.

We compare relational and NoSQL databases, discussing when to use each and how to avoid common design mistakes. Real-world examples illustrate the concepts in action.

Whether you are using PostgreSQL, MongoDB, or any other database system, the principles discussed here will help you design more efficient and maintainable data layers.`,
];

const IMAGE_KEYWORDS = [
  'coding', 'technology', 'laptop', 'code', 'server', 'database',
  'network', 'security', 'mobile', 'web', 'cloud', 'data',
  'programming', 'developer', 'computer', 'software', 'ai', 'robot',
];

function randomDate() {
  const now = Date.now();
  const daysBack = Math.floor(Math.random() * 365);
  const hoursBack = Math.floor(Math.random() * 24);
  return new Date(now - daysBack * 86400000 - hoursBack * 3600000);
}

function randomImageUrl(index) {
  const keyword = IMAGE_KEYWORDS[index % IMAGE_KEYWORDS.length];
  const seed = `${keyword}-${index}`;
  const width = 800;
  const height = 400;
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: SEED_USER.email });
    if (!user) {
      user = await User.create({
        username: SEED_USER.username,
        email: SEED_USER.email,
        password: SEED_USER.password,
      });
      console.log('Created seed user:', user.username);
    } else {
      console.log('Using existing user:', user.username);
    }

    await Post.deleteMany({ authorId: user._id });
    console.log('Cleared existing posts for seed user');

    const posts = [];
    const totalPosts = 55;

    for (let i = 0; i < totalPosts; i++) {
      const titleIndex = i % TITLES.length;
      const titleSuffix = i >= TITLES.length ? ` (Part ${Math.floor(i / TITLES.length) + 1})` : '';
      const title = `${TITLES[titleIndex]}${titleSuffix}`;

      const contentIndex = i % CONTENTS.length;
      const content = CONTENTS[contentIndex];

      const categoryIndex = i % CATEGORIES.length;
      const category = CATEGORIES[categoryIndex];

      const hasImage = i % 3 !== 1;
      const imageUrl = hasImage ? randomImageUrl(i) : '';

      posts.push({
        title,
        content,
        author: user.username,
        authorId: user._id,
        category,
        imageUrl,
        createdAt: randomDate(),
      });
    }

    await Post.insertMany(posts);
    console.log(`Inserted ${posts.length} posts successfully`);

    console.log(`\nSeed user credentials:`);
    console.log(`  Username: ${SEED_USER.username}`);
    console.log(`  Email:    ${SEED_USER.email}`);
    console.log(`  Password: ${SEED_USER.password}`);
    console.log(`\nLogin and check your dashboard to see all posts.`);

    await mongoose.disconnect();
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
