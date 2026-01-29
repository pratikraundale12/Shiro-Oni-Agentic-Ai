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
    const ms = Number(log.timestamp.toString().substring(0, 13));
    const dateObj = new Date(ms);

    return {
      id: log.timestamp, // Keep nanoseconds as unique ID
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
      severity: log.severity,
      message: log.body,
      job: log.labels?.job || 'N/A',
      level: log.labels?.level || log.severity,
      host: log.resources?.['host.name'] || 'N/A',
      service: log.labels?.service_name || 'N/A',
    };
  });
};
