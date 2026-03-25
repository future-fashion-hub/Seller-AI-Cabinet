import { useEffect } from 'react';
import { clearCurrentItem, fetchAdById } from '../store/adsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useCurrentItem = (id?: string) => {
  const dispatch = useAppDispatch();
  const currentItem = useAppSelector((state) => state.ads.currentItem);
  const currentItemLoading = useAppSelector((state) => state.ads.currentItemLoading);
  const currentItemError = useAppSelector((state) => state.ads.currentItemError);

  useEffect(() => {
    if (!id) {
      return () => {
        dispatch(clearCurrentItem());
      };
    }

    const request = dispatch(fetchAdById(id));

    return () => {
      request.abort();
      dispatch(clearCurrentItem());
    };
  }, [id, dispatch]);

  return {
    currentItem,
    currentItemLoading,
    currentItemError,
  };
};
