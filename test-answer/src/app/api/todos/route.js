import { NextResponse } from 'next/server';
import { getSqlPool } from '../../../server/database/connection';

function normalizeTodo(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    dateTime: row.dateTime ? new Date(row.dateTime).toLocaleString() : '',
    completed: Boolean(row.completed),
  };
}

function escapeLikePattern(value) {
  return value.replace(/([%_\\[\]])/g, '\\$1');
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawSearch = searchParams.get('search')?.trim() || '';
    const search = rawSearch ? escapeLikePattern(rawSearch) : '';
    const statuses = searchParams.getAll('status');
    const pool = await getSqlPool();
    const queryBuilder = pool.request();
    const whereClauses = [];

    if (search) {
      whereClauses.push('(title LIKE @search ESCAPE \'\\\' OR content LIKE @search ESCAPE \'\\\')');
      queryBuilder.input('search', `%${search}%`);
    }

    if (statuses.length > 0) {
      const normalizedStatuses = statuses.map(status => status.toLowerCase());
      const completedValues = normalizedStatuses
        .filter(status => status === 'completed' || status === 'in-progress')
        .map(status => status === 'completed' ? 1 : 0);

      if (completedValues.length === 1) {
        whereClauses.push('completed = @completed');
        queryBuilder.input('completed', completedValues[0]);
      } else if (completedValues.length > 1) {
        const placeholders = completedValues.map((_, index) => `@completed${index}`).join(', ');
        whereClauses.push(`completed IN (${placeholders})`);
        completedValues.forEach((value, index) => queryBuilder.input(`completed${index}`, value));
      }
    }

    let query = 'SELECT id, title, content, [dateTime], completed FROM dbo.todos';

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ' ORDER BY id DESC';

    const result = await queryBuilder.query(query);

    return NextResponse.json(result.recordset.map(normalizeTodo));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const pool = await getSqlPool();
    const result = await pool.request()
      .input('title', body.title ?? 'Untitled task')
      .input('content', body.content ?? '')
      .input('dateTime', body.dateTime ? new Date(body.dateTime) : null)
      .input('completed', Boolean(body.completed))
      .query(`INSERT INTO dbo.todos (title, content, [dateTime], completed)
              OUTPUT inserted.id, inserted.title, inserted.content, inserted.[dateTime], inserted.completed
              VALUES (@title, @content, @dateTime, @completed)`);

    return NextResponse.json(normalizeTodo(result.recordset[0]));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
