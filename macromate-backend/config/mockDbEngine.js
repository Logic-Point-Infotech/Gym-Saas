// macromate-backend/config/mockDbEngine.js
// Lightweight query executor for in-memory fallback
const { mockData, autoIncrement } = require('./mockStore');

function executeMockQuery(sql, params = []) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  // 1. SELECT queries
  if (/^SELECT/i.test(cleanSql)) {
    const fromMatch = cleanSql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    if (!fromMatch) return [[], { rows: [] }];
    const tableName = fromMatch[1].toLowerCase();
    const rows = mockData[tableName] ? [...mockData[tableName]] : [];

    // Filter by WHERE
    let filtered = rows;
    if (/WHERE/i.test(cleanSql)) {
      if (/client_id\s*=\s*\?/i.test(cleanSql)) {
        const cId = Number(params[0]);
        filtered = filtered.filter(r => Number(r.client_id) === cId);
      } else if (/user_id\s*=\s*\?/i.test(cleanSql)) {
        const uId = Number(params[0]);
        filtered = filtered.filter(r => Number(r.user_id) === uId);
      } else if (/id\s*=\s*\?/i.test(cleanSql)) {
        const idVal = Number(params[0]);
        filtered = filtered.filter(r => Number(r.id) === idVal);
      } else if (/email\s*=\s*\?/i.test(cleanSql)) {
        const email = String(params[0]).toLowerCase();
        filtered = filtered.filter(r => String(r.email).toLowerCase() === email);
      } else if (/member_id\s*=\s*\?/i.test(cleanSql)) {
        const memberId = String(params[0]);
        filtered = filtered.filter(r => r.member_id === memberId);
      } else if (/role\s*=\s*\?/i.test(cleanSql)) {
        const role = String(params[0]);
        filtered = filtered.filter(r => r.role === role);
      } else if (/role\s*=\s*'([^']+)'/i.test(cleanSql)) {
        const role = cleanSql.match(/role\s*=\s*'([^']+)'/i)[1];
        filtered = filtered.filter(r => r.role === role);
      } else if (/plan_id\s*=\s*\?/i.test(cleanSql)) {
        const pId = Number(params[0]);
        filtered = filtered.filter(r => Number(r.plan_id) === pId);
      } else if (/day_id\s*=\s*\?/i.test(cleanSql)) {
        const dId = Number(params[0]);
        filtered = filtered.filter(r => Number(r.day_id) === dId);
      } else if (/log_id\s*=\s*\?/i.test(cleanSql)) {
        const lId = Number(params[0]);
        filtered = filtered.filter(r => Number(r.log_id) === lId);
      } else if (/status\s*=\s*\?/i.test(cleanSql)) {
        const st = String(params[0]);
        filtered = filtered.filter(r => r.status === st);
      }
    }

    // ORDER BY
    if (/ORDER BY\s+([a-zA-Z0-9_]+)\s+(DESC|ASC)/i.test(cleanSql)) {
      const match = cleanSql.match(/ORDER BY\s+([a-zA-Z0-9_]+)\s+(DESC|ASC)/i);
      const col = match[1];
      const isDesc = match[2].toUpperCase() === 'DESC';
      filtered.sort((a, b) => {
        if (a[col] < b[col]) return isDesc ? 1 : -1;
        if (a[col] > b[col]) return isDesc ? -1 : 1;
        return 0;
      });
    }

    // LIMIT
    if (/LIMIT\s+([0-9]+)/i.test(cleanSql)) {
      const limit = parseInt(cleanSql.match(/LIMIT\s+([0-9]+)/i)[1], 10);
      filtered = filtered.slice(0, limit);
    }

    filtered.insertId = filtered[0]?.id;
    return [filtered, { rows: filtered }];
  }

  // 2. INSERT queries
  if (/^INSERT INTO/i.test(cleanSql)) {
    const match = cleanSql.match(/INSERT INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      const cols = match[2].split(',').map(c => c.trim().toLowerCase());
      if (!mockData[tableName]) mockData[tableName] = [];

      const newId = ++autoIncrement[tableName] || Date.now();
      const newRecord = { id: newId };
      cols.forEach((col, idx) => {
        newRecord[col] = params[idx];
      });

      if (!newRecord.created_at) newRecord.created_at = new Date().toISOString();
      if (!newRecord.recorded_at) newRecord.recorded_at = new Date().toISOString();
      if (!newRecord.logged_at) newRecord.logged_at = new Date().toISOString();

      mockData[tableName].push(newRecord);
      const rows = [{ id: newId, ...newRecord }];
      rows.insertId = newId;
      return [rows, { rows, insertId: newId }];
    }
  }

  // 3. UPDATE queries
  if (/^UPDATE/i.test(cleanSql)) {
    const match = cleanSql.match(/UPDATE\s+([a-zA-Z0-9_]+)/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      const records = mockData[tableName] || [];
      return [[{ affectedRows: 1 }], { affectedRows: 1 }];
    }
  }

  // 4. DELETE queries
  if (/^DELETE FROM/i.test(cleanSql)) {
    const match = cleanSql.match(/DELETE FROM\s+([a-zA-Z0-9_]+)/i);
    if (match) {
      const tableName = match[1].toLowerCase();
      if (mockData[tableName] && params[0] !== undefined) {
        mockData[tableName] = mockData[tableName].filter(r => r.id !== Number(params[0]));
      }
      return [[{ affectedRows: 1 }], { affectedRows: 1 }];
    }
  }

  return [[], { rows: [] }];
}

module.exports = {
  executeMockQuery,
};
