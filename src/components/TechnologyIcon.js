import React from 'react';
import {
  SiPython, SiMongodb, SiNodedotjs, SiFastapi, SiTypescript, SiNextdotjs, SiReact, SiJavascript,
  SiHtml5, SiTailwindcss, SiPostgresql, SiPrisma, SiSqlalchemy,
  SiZod, SiSanity, SiFirebase, SiGit, SiVitest, SiVite, SiDocker,
} from 'react-icons/si';
import { DiCode, DiCss3 } from 'react-icons/di';
import { FaAws } from 'react-icons/fa';
import { TbSql, TbApi } from 'react-icons/tb';
const PlaywrightIcon = props => <img {...props} src="https://playwright.dev/img/playwright-logo.svg" alt="" />;

const technologyIcons = {
  Python: SiPython, 'Node.js': SiNodedotjs, FastAPI: SiFastapi, TypeScript: SiTypescript, 'Next.js': SiNextdotjs,
  React: SiReact, JavaScript: SiJavascript, HTML5: SiHtml5, CSS3: DiCss3,
  'Tailwind CSS': SiTailwindcss, PostgreSQL: SiPostgresql, MongoDB: SiMongodb, Prisma: SiPrisma,
  SQLAlchemy: SiSqlalchemy, Firebase: SiFirebase, Git: SiGit, Vitest: SiVitest,
  Playwright: PlaywrightIcon, Vite: SiVite, AWS: FaAws, Docker: SiDocker, SQL: TbSql, 'REST APIs': TbApi, Zod: SiZod, Sanity: SiSanity, 'AlAdhan API': TbApi, 'Node.js Test Runner': SiNodedotjs,
};

export default function TechnologyIcon({ technology, ...props }) {
  const Icon = technologyIcons[technology] || DiCode;
  return <Icon {...props} aria-hidden="true" />;
}
