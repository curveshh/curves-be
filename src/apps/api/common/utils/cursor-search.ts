export type Cursor = {
  id: string;
  createdAt: Date;
};

function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64');
}

export function decodeCursor(cursor: string) {
  return JSON.parse(Buffer.from(cursor, 'base64').toString()) as {
    id: string;
    createdAt: string;
  };
}

export interface CursorPage<TData> {
  data: TData[];
  nextCursor?: string;
  hasNextPage: boolean;
}

export async function cursorSearch<
  TResult extends {
    id: string;
    createdAt: Date;
  },
>(query: (take: number) => Promise<TResult[]>, take = 20): Promise<CursorPage<TResult>> {
  const rows = await query(take + 1);
  let nextCursor: string | undefined;

  if (rows.length > take) {
    const last = rows.pop()!;

    nextCursor = encodeCursor({
      id: last.id,
      createdAt: last.createdAt,
    });
  }

  return {
    data: rows,
    nextCursor,
    hasNextPage: nextCursor !== undefined,
  };
}
