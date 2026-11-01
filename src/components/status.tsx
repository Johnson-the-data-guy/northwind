export function Loading() {
  return <p className="gutter label py-16 text-muted-foreground" role="status">Loading the work</p>;
}

export function LoadError() {
  return (
    <p className="gutter py-16 text-muted-foreground" role="alert">
      The work could not be loaded just now. Refresh the page to try again.
    </p>
  );
}
