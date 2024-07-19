export const CrossIconWithBorder = ({
  width = 20,
  height = 20,
  color = "#444445",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
  >
    <path
      fill={color}
      d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10Zm0-11.414L7.172 5.757 5.757 7.172 8.586 10l-2.829 2.828 1.415 1.415L10 11.414l2.828 2.829 1.415-1.415L11.414 10l2.829-2.828-1.415-1.415L10 8.586Z"
    />
  </svg>
);

export const CrossIconWithBorderGrey = ({ width = 26, height = 26 }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="16.5" cy="16.5" r={16} fill="white" stroke="#DDE4F0" />
      <path
        d="M15.1953 16.1381L10 10.9428L10.9428 10L16.1381 15.1952L21.3334 10L22.2762 10.9428L17.0809 16.1381L22.2762 21.3333L21.3334 22.2762L16.1381 17.0809L10.9428 22.2762L10 21.3333L15.1953 16.1381Z"
        fill="black"
      />
    </svg>
  );
};
