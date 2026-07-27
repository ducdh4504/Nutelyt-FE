export function isHealthProfileReviewPayload(profileParam: string | undefined) {
  if (!profileParam) {
    return false;
  }

  try {
    const parsed = JSON.parse(profileParam) as {
      age?: unknown;
      dateOfBirth?: unknown;
      diseases?: unknown;
      dietLabel?: unknown;
      goalLabel?: unknown;
    };

    return (
      typeof parsed.dateOfBirth === 'string' &&
      typeof parsed.goalLabel === 'string' &&
      typeof parsed.dietLabel === 'string' &&
      typeof parsed.age === 'undefined' &&
      typeof parsed.diseases === 'undefined'
    );
  } catch {
    return false;
  }
}

export function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const last = parts.at(-1) ?? '';

  return (last.charAt(0) || 'N').toLocaleUpperCase('vi-VN');
}
