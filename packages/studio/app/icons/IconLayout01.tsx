export const IconLayout01 = ({
  dxSize = 24,
  ...restProps
}: React.SVGProps<SVGSVGElement> & { dxSize: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={dxSize}
    height={dxSize}
    color="currentColor"
    fill={"none"}
    {...restProps}
  >
    <title>layout</title>
    <path
      d="M3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28248 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28248 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2.5 9L21.5 9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 21.5L8 9" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
