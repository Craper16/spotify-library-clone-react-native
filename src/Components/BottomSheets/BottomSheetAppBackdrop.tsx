import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React from 'react';

const BottomSheetAppBackdrop = (backdropProps: BottomSheetBackdropProps) => {
  return (
    <BottomSheetBackdrop
      {...backdropProps}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.5}
    />
  );
};

export default React.memo(BottomSheetAppBackdrop);
