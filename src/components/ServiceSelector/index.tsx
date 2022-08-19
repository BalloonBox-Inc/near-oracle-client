import { BORDER_GRADIENT_STYLE } from "@nearoracle/src/constants";

const ServiceSelector = ({
  selected,
  onClick,
  text,
  title,
  testId,
  img,
  className,
  alt,
}: any) => {
  const contentWithTitle = (
    <div className="text-left text-white">
      <h3 className="text-lg sm:text-xl font-medium mb-3">{title}</h3>
      <p className="text-xs font-thin">{text}</p>
    </div>
  );

  const contentWithoutTitle = (
    <div className="flex justify-center">
      {text ? (
        <p className="text-lg m-0">{text}</p>
      ) : (
        <img src={img} alt={alt} className={className} />
      )}
    </div>
  );

  return (
    <div
      data-testid={testId}
      className="flex z-50 w-80 sm:w-115 justify-center rounded-md p-1"
      style={{
        background: selected ? BORDER_GRADIENT_STYLE : "transparent",
      }}
    >
      <div
        onClick={onClick}
        className={`bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full rounded-md p-5 px-8`}
      >
        {title ? contentWithTitle : contentWithoutTitle}
      </div>
    </div>
  );
};

export default ServiceSelector;
