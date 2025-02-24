export interface InputProps {
  placeholder: string;
  reference?: React.RefObject<HTMLInputElement>;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  value?: string;
  type?: string;
  className?: string;
}

const variantStyles = {
  primary: "border-purple-300 focus:ring-purple-300 focus:border-purple-300",
  secondary: "border-purple-500 focus:ring-purple-500 focus:border-purple-500",
};

const sizeStyles = {
  sm: "px-2 py-1 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const defaultStyles = "border rounded outline-none focus:ring-2 focus:ring-opacity-50 transition-all";

export function Input({
  placeholder,
  reference,
  variant = "primary",
  size = "md",
  onChange,

  value,
  type = "text",
  className
}: InputProps) {
  return (
    <input
      ref={reference}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}

      className={`${variantStyles[variant]} ${sizeStyles[size]} ${defaultStyles} ${className || ''}`}
    />
  );
}