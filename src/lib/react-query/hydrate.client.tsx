import {
  HydrationBoundaryProps,
  HydrationBoundary,
} from "@tanstack/react-query";

function hydrate(props: HydrationBoundaryProps) {
  return <HydrationBoundary {...props} />;
}

export default hydrate;
