import { ReactNode } from "react";

import cx from "classnames";
import { ClipLoader } from "react-spinners";

interface IButtonClasses {
  container?: string;
  button?: string;
  bg?: string;
  hover?: string;
  textColor?: string;
}

interface IButtonField {
  text: string | ReactNode;
  classes?: IButtonClasses;
  onClick?: (e: React.ChangeEvent<any>) => void;
  isSubmit?: boolean;
  type?: BUTTON_ACTION;
  style?: BUTTON_STYLES;
  isDisabled?: boolean;
  isLoading?: boolean;
  id?: string;
}

export enum BUTTON_STYLES {
  DEFAULT = "default",
  OUTLINE = "outline",
  LINK = "link",
  BLACK = "dark",
}

export enum BUTTON_ACTION {
  SUBMIT = "submit",
  BUTTON = "button",
  RESET = "reset",
}

export default function Button({
  onClick,
  text,
  classes,
  type,
  isDisabled = false,
  style = BUTTON_STYLES.DEFAULT,
  isLoading,
  id,
}: IButtonField) {
  const classnames = cx(
    {
      "inline-flex justify-center py-2 px-6 text-sm rounded-3xl focus:outline-none":
        style !== BUTTON_STYLES.LINK,
      "hover:opacity-75 text-sm underline": style === BUTTON_STYLES.LINK,
      "text-white border-solid border-2 border-white py-2 cursor-pointer hover:bg-zinc-800":
        style === BUTTON_STYLES.OUTLINE,
      "text-white btn-gradient hover:opacity-75 cursor-pointer min-w-4 gradient-outline ":
        style === BUTTON_STYLES.DEFAULT,
      "disabled:opacity-70 cursor-default gradient-outline-grayscale":
        isDisabled || isLoading,
    },
    classes?.button || ""
  );

  const button = (
    <button
      disabled={isDisabled}
      onClick={onClick || undefined}
      type={type}
      id={id}
      className={classnames}
      style={{ minWidth: "100px" }}
    >
      {isLoading ? (
        <ClipLoader speedMultiplier={1.25} size={20} color="#fff" />
      ) : (
        text
      )}
    </button>
  );

  return (
    <div
      style={{
        borderRadius: "400px",
        padding: "3px",
        justifyItems: "center",
        alignItems: "center",
        cursor: "pointer",
        zIndex: "50",
      }}
      className={classes?.container}
    >
      {button}
    </div>
  );
}
