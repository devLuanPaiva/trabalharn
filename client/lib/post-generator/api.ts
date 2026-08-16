import { GeneratedPost, JobPostingRequest } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

export async function generateJobPost(payload: JobPostingRequest): Promise<GeneratedPost> {
  const response = await fetch(`${API_BASE_URL}/post-generator/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Não foi possível gerar a arte. Confira os dados e tente novamente.');
  }

  return response.json();
}
