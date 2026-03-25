import { useCallback, useEffect, useMemo, useState } from 'react';
import type { SetURLSearchParams } from 'react-router-dom';

const MOBILE_BREAKPOINT = 768;
const SEARCH_DEBOUNCE_MS = 350;
const DEFAULT_SORT = 'createdAt:desc';
const DEFAULT_VIEW_MODE: 'grid' | 'list' = 'grid';

export const HOME_PAGE_LIMIT = 10;

export const useHomeFilters = (
  searchParams: URLSearchParams,
  setSearchParams: SetURLSearchParams,
) => {
  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 1);
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(() => searchParams.get('search') || '');
  const [categories, setCategories] = useState<string[]>(() => {
    const cats = searchParams.get('categories');
    return cats ? cats.split(',') : [];
  });
  const [needsRevision, setNeedsRevision] = useState(
    () => searchParams.get('needsRevision') === 'true',
  );
  const [sortOption, setSortOption] = useState<string>(
    () => searchParams.get('sortOption') || DEFAULT_SORT,
  );
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(
    () => (searchParams.get('viewMode') as 'grid' | 'list') || DEFAULT_VIEW_MODE,
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT);

  const effectiveViewMode: 'grid' | 'list' = isMobile ? 'list' : viewMode;

  const updateURL = useCallback(
    (params: Record<string, string | number | boolean>) => {
      const nextParams = new URLSearchParams(window.location.search);

      Object.entries(params).forEach(([key, value]) => {
        const shouldDelete =
          value === '' ||
          value === false ||
          (key === 'page' && value === 1) ||
          (key === 'sortOption' && value === DEFAULT_SORT) ||
          (key === 'viewMode' && value === DEFAULT_VIEW_MODE);

        if (shouldDelete) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      setSearchParams(nextParams, { replace: true });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      updateURL({ search, page: 1 });
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [search, updateURL]);

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const updateSearch = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  }, []);

  const updateCategories = useCallback(
    (newCategories: string[]) => {
      setCategories(newCategories);
      setPage(1);
      updateURL({ categories: newCategories.join(','), page: 1 });
    },
    [updateURL],
  );

  const updateNeedsRevision = useCallback(
    (newNeedsRevision: boolean) => {
      setNeedsRevision(newNeedsRevision);
      setPage(1);
      updateURL({ needsRevision: newNeedsRevision, page: 1 });
    },
    [updateURL],
  );

  const updateSortOption = useCallback(
    (newSortOption: string) => {
      setSortOption(newSortOption);
      setPage(1);
      updateURL({ sortOption: newSortOption, page: 1 });
    },
    [updateURL],
  );

  const updateViewMode = useCallback(
    (newViewMode: 'grid' | 'list') => {
      if (isMobile) {
        return;
      }

      setViewMode(newViewMode);
      setPage(1);
      updateURL({ viewMode: newViewMode, page: 1 });
    },
    [isMobile, updateURL],
  );

  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      updateURL({ page: newPage });
    },
    [updateURL],
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setDebouncedSearch('');
    setCategories([]);
    setNeedsRevision(false);
    setSortOption(DEFAULT_SORT);
    setPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const fetchParams = useMemo(() => {
    const params: Record<string, string | number | boolean> = {
      limit: HOME_PAGE_LIMIT,
      skip: (page - 1) * HOME_PAGE_LIMIT,
    };

    if (debouncedSearch) {
      params.q = debouncedSearch;
    }

    if (categories.length > 0) {
      params.categories = categories.join(',');
    }

    if (needsRevision) {
      params.needsRevision = true;
    }

    if (sortOption) {
      const [column, direction] = sortOption.split(':');
      params.sortColumn = column;
      params.sortDirection = direction;
    }

    return params;
  }, [page, debouncedSearch, categories, needsRevision, sortOption]);

  return {
    page,
    search,
    categories,
    needsRevision,
    sortOption,
    isMobile,
    effectiveViewMode,
    updateSearch,
    updateCategories,
    updateNeedsRevision,
    updateSortOption,
    updateViewMode,
    updatePage,
    resetFilters,
    fetchParams,
  };
};
