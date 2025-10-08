import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

const BottomSheetModal = forwardRef(
  ({ children, height = 'auto', customStyles = {}, ...rest }, ref) => {
    const innerRef = useRef();
    useImperativeHandle(ref, () => ({
      open: () => innerRef.current.open(),
      close: () => innerRef.current.close(),
    }));
    return (
      <RBSheet
        ref={innerRef}
        height={height}
        openDuration={250}
        closeDuration={200}
        customStyles={customStyles}
        {...rest}
      >
        {children}
      </RBSheet>
    );
  },
);
export default BottomSheetModal;
