export const CircleExclamationMark = ({
  width = 20,
  height = 20,
  color = '#444445',
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10ZM9 9v6h2V9H9Zm0-4v2h2V5H9Z"
    />
  </svg>
);
