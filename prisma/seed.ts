import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.bookmarkTag.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.user.deleteMany({});

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'javascript' } }),
    prisma.tag.create({ data: { name: 'design' } }),
    prisma.tag.create({ data: { name: 'productivity' } }),
    prisma.tag.create({ data: { name: 'tutorial' } }),
    prisma.tag.create({ data: { name: 'react' } }),
    prisma.tag.create({ data: { name: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'typescript' } }),
    prisma.tag.create({ data: { name: 'css' } }),
  ]);

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'curator.chloe@example.com',
        name: 'Curator Chloe',
        image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=chloe',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'learner.leo@example.com',
        name: 'Learner Leo',
        image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=leo',
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'marketer.maya@example.com',
        name: 'Marketer Maya',
        image: 'https://api.dicebear.com/8.x/avataaars/svg?seed=maya',
        emailVerified: new Date(),
      },
    }),
  ]);

  // Sample bookmarks data
  const bookmarksData = [
    {
      url: 'https://react.dev/',
      title: 'React – The library for web and native user interfaces',
      description:
        'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.',
      image: 'https://react.dev/images/og-home.png',
      favicon: 'https://react.dev/favicon.ico',
      isPublic: true,
      tags: ['react', 'javascript', 'tutorial'],
    },
    {
      url: 'https://nextjs.org/',
      title: 'Next.js by Vercel - The React Framework for the Web',
      description:
        "Used by some of the world's largest companies, Next.js enables you to create high-quality web applications with the power of React components.",
      image: 'https://nextjs.org/static/twitter-cards/home.jpg',
      favicon: 'https://nextjs.org/favicon.ico',
      isPublic: true,
      tags: ['nextjs', 'react', 'javascript'],
    },
    {
      url: 'https://www.typescriptlang.org/',
      title: 'TypeScript: JavaScript With Syntax For Types',
      description:
        'TypeScript extends JavaScript by adding types to the language.',
      image: 'https://www.typescriptlang.org/images/ts-social.jpg',
      favicon: 'https://www.typescriptlang.org/favicon.ico',
      isPublic: true,
      tags: ['typescript', 'javascript'],
    },
    {
      url: 'https://tailwindcss.com/',
      title:
        'Tailwind CSS - Rapidly build modern websites without ever leaving your HTML',
      description:
        'Tailwind CSS is a utility-first CSS framework for rapidly building modern websites without ever leaving your HTML.',
      image:
        'https://tailwindcss.com/_next/static/media/social-card-large.f6878fd8df804f73ba3f1a271122105a.jpg',
      favicon: 'https://tailwindcss.com/favicons/favicon.ico',
      isPublic: false,
      tags: ['css', 'design'],
    },
    {
      url: 'https://developer.mozilla.org/en-US/docs/Learn',
      title: 'Learn web development | MDN',
      description:
        'Welcome to MDN Learning Area. This set of articles aims to guide complete beginners to web development with all that they need to start coding websites.',
      image: 'https://developer.mozilla.org/mdn-social-share.cd87e963e8f7.png',
      favicon: 'https://developer.mozilla.org/favicon-48x48.cbbd161b.png',
      isPublic: true,
      tags: ['tutorial', 'javascript', 'css'],
    },
    {
      url: 'https://www.figma.com/',
      title: 'Figma: The Collaborative Interface Design Tool',
      description:
        'Figma is the leading collaborative design tool for building meaningful products. Seamlessly design, prototype, develop, and collect feedback in a single platform.',
      image:
        'https://cdn.sanity.io/images/599r6htc/regionalized/46a76c802176eb17b04e12108de7e7e0f3736dc6-1200x630.png',
      favicon: 'https://static.figma.com/app/icon/1/favicon.png',
      isPublic: true,
      tags: ['design', 'productivity'],
    },
    {
      url: 'https://www.notion.so/',
      title: 'Notion – Your connected workspace for wiki, docs & projects',
      description:
        "A new tool that blends your everyday work apps into one. It's the all-in-one workspace for you and your team.",
      image:
        'https://www.notion.so/cdn-cgi/image/format=auto,width=1920,quality=100/front-static/shared/illustrations/home-hero-tile.png',
      favicon: 'https://www.notion.so/images/favicon.ico',
      isPublic: false,
      tags: ['productivity'],
    },
    {
      url: 'https://github.com/',
      title: "GitHub: Let's build from here",
      description:
        'GitHub is where over 100 million developers shape the future of software, together.',
      image:
        'https://github.githubassets.com/images/modules/site/social-cards/github-social.png',
      favicon: 'https://github.githubassets.com/favicons/favicon.svg',
      isPublic: true,
      tags: ['productivity', 'javascript'],
    },
  ];

  // Create bookmarks for each user
  for (const user of users) {
    // Give each user different bookmarks
    const userBookmarks = bookmarksData.slice(
      (users.indexOf(user) * 3) % bookmarksData.length,
      ((users.indexOf(user) + 1) * 5) % bookmarksData.length ||
        bookmarksData.length
    );

    for (const bookmarkData of userBookmarks) {
      const { tags: tagNames, ...bookmarkInfo } = bookmarkData;

      const bookmark = await prisma.bookmark.create({
        data: {
          ...bookmarkInfo,
          userId: user.id,
        },
      });

      // Connect tags
      const tagConnections = tagNames
        .map((tagName) => {
          const tag = tags.find((t) => t.name === tagName);
          return tag ? { bookmarkId: bookmark.id, tagId: tag.id } : null;
        })
        .filter(Boolean) as Array<{ bookmarkId: string; tagId: string }>;

      if (tagConnections.length > 0) {
        await prisma.bookmarkTag.createMany({
          data: tagConnections,
        });
      }
    }
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${users.length} users`);
  console.log(`Created ${tags.length} tags`);
  console.log(`Created bookmarks with tags`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
