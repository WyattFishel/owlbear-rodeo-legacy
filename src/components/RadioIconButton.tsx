import { IconButton, IconButtonProps } from "theme-ui";

type RadioButttonProps = {
  isSelected: boolean;
} & IconButtonProps;

function RadioIconButton({
  title,
  onClick,
  isSelected,
  disabled = false,
  children,
  ...props
}: RadioButttonProps) {
  return (
    <IconButton
      aria-label={title}
      title={title}
      onClick={onClick}
      sx={{ color: isSelected ? "primary" : "text" }}
      disabled={disabled}
      {...props}
    >
      {children}
    </IconButton>
  );
}

export default RadioIconButton;
