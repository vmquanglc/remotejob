import { useUrlSearchParams } from "use-url-search-params";

export const useSearchParams = (initialValues) => {
  const searchParams = useUrlSearchParams(initialValues);
  return searchParams
};
