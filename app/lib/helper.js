export function entriesToMarkDown(entries, type) {
  if (!entries?.length) return "";
  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const datRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${datRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}
