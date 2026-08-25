import { NotFoundException } from '@nestjs/common';

export async function ensureExists<T>(data: Promise<T | null>, message: string): Promise<T> {
  const result = await data;

  if (!result) {
    throw new NotFoundException(message);
  }

  return result;
}
