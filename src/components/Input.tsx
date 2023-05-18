import { type FC } from "react";
import { type Control, useController } from "react-hook-form";

type InputProps = {
  name: string;
  control: Control;
  type: "text" | "email" | "textarea";
  label?: string;
  placeholder?: string;
  defaultValue?: string;
};

const Input: FC<InputProps> = ({
  name,
  control,
  type,
  label,
  placeholder,
  defaultValue,
}) => {
  const { field } = useController({ control, name });

  return (
    <div className="flex w-full flex-col gap-y-2">
      <label htmlFor={name} className="font-medium text-white">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          className="resize-none rounded-md border-2 border-[#393945] bg-transparent p-3 text-sm font-medium text-white focus:outline-none"
          placeholder={placeholder}
          id={name}
          rows={5}
          defaultValue={defaultValue}
          autoComplete="no"
          {...field}
        />
      ) : (
        <input
          autoComplete="no"
          id={name}
          className="w-full rounded-md border-2 border-[#393945] bg-transparent p-3 text-sm font-medium text-white focus:outline-none"
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          {...field}
        />
      )}
    </div>
  );
};
export default Input;
