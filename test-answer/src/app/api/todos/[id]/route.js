import { NextResponse } from 'next/server';
import { getSqlPool } from '../../../../server/database/connection';

function normalizeTodo(row) {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    dateTime: row.dateTime ? new Date(row.dateTime).toLocaleString() : '',
    completed: Boolean(row.completed),
  };
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const pool = await getSqlPool();
    const result = await pool.request()
      .input('id', Number(id))
      .input('title', body.title ?? 'Untitled task')
      .input('content', body.content ?? '')
      .input('dateTime', body.dateTime ? new Date(body.dateTime) : null)
      .input('completed', Boolean(body.completed))
      .query(`UPDATE dbo.todos
              SET title = @title, content = @content, [dateTime] = @dateTime, completed = @completed
              OUTPUT inserted.id, inserted.title, inserted.content, inserted.[dateTime], inserted.completed
              WHERE id = @id`);

    if (!result.recordset[0]) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(normalizeTodo(result.recordset[0]));
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const pool = await getSqlPool();
    const result = await pool.request()
      .input('id', Number(id))
      .query('DELETE FROM dbo.todos WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
