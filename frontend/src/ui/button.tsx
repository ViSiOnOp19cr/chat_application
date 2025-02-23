export interface ButtonProps {
    varient: "primary" | "secondary";
    size: "sm" | "md" | "lg";
    text: string;
    startIcon?: any;
    endIcon?: any;
    onClick?: () => void;
  }
  const varientStyles = {
    primary: "bg-purple-300 text-purple-500",
    secondary: "bg-purple-500 text-white",
  };
  const sizeStyles = {
    sm: "py-1 px-2",
    md: "py-2 px-4",
    lg: "py-3 px-6",
  };
  
  const defaultstyles = "rounded-md p-4 flex";
  export const Button = (props: ButtonProps) => {
    return (
      <button
        onClick={props.onClick}
        className={`${varientStyles[props.varient]} ${defaultstyles} 
      ${sizeStyles[props.size]}`}
      >
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}{" "}
        {props.text} {props.endIcon}
      </button>
    );
  };
  