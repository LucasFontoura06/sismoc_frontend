import { ForwardedRef, forwardRef } from "react";
import { IMaskInput } from "react-imask";

const InputFormMask = forwardRef((props: any, ref: ForwardedRef<HTMLInputElement>) => {
  const { mask, ...other } = props;

  return (
    <IMaskInput
      {...other}
      inputRef={ref}
      mask={mask}
      definitions={{
        '_': /[0-9]/
      }}
      unmask={true}
      // onAccept={(value) => console.log(value)}
    />
  );
});

export default InputFormMask;
