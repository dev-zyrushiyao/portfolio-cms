export default function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
  type: "button" | "submit";
}) {
  //   useEffect(() => {}, [label]);

  return (
    <button
      className="bg-amber-300 p-1 lg:w-[10vw] w-[30vw] h-10 rounded-2xl cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
