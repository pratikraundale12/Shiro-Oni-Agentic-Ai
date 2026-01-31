export const aggregateLogsForChart = logs => {
  if (!logs) return [];

  const buckets = {};
  logs.forEach(log => {
    const rawTime = log.timestamp || log.time;
    // Handle nanoseconds to milliseconds
    const ms = !isNaN(rawTime)
      ? Number(rawTime.toString().substring(0, 13))
      : new Date(rawTime).getTime();

    // Centered minute aggregation: Round to the nearest minute
    const minuteBucket = Math.round(ms / 60000) * 60000;
    const severity = (
      log.severity ||
      log.labels?.level ||
      'INFO'
    ).toUpperCase();

    if (!buckets[minuteBucket]) {
      buckets[minuteBucket] = {
        date: new Date(minuteBucket),
        ERROR: 0,
        INFO: 0,
        total: 0,
      };
    }

    if (severity === 'ERROR' || severity === 'CRITICAL')
      buckets[minuteBucket].ERROR++;
    else buckets[minuteBucket].INFO++;

    buckets[minuteBucket].total++;
  });

  return Object.values(buckets).sort((a, b) => a.date - b.date);
};

// 2. Flattening for the Table
export const transformLogsForTable = (logs = []) => {
  return logs.map(log => {
    // Convert nanoseconds → milliseconds
    const ms = Number(log.timestamp.toString().substring(0, 13));
    const dateObj = new Date(ms);

    const rawLevel = log.labels?.level || log.labels?.detected_level || 'INFO';
    const normalizedLevel =
      String(rawLevel).toUpperCase() === 'ERROR' ? 'ERROR' : 'INFO';

    return {
      id: log.timestamp,
      timestamp: dateObj.toISOString(),
      formattedTimestamp: dateObj.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),

      message: log.parsedBody || 'N/A',
      severity: normalizedLevel,
      level: normalizedLevel,

      service: log.labels?.service_name || 'N/A',
      host: log.labels?.service_instance_id || 'N/A',
      job: log.labels?.scope_name || 'N/A',
    };
  });
};
