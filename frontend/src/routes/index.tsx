import { createFileRoute } from '@tanstack/react-router';
import HomePage from '@/modules/home/pages';

export const Route = createFileRoute('/')({
  component: HomePage,
});
