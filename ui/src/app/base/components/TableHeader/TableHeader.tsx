import type { ReactNode } from "react";

import type { ButtonProps } from "@canonical/react-components";
import { Button, Icon } from "@canonical/react-components";

import type { Sort } from "app/base/types";

type Props = {
  children: ReactNode;
  className?: string;
  currentSort?: Sort;
  onClick?: ButtonProps["onClick"];
  sortKey?: string;
};

const TableHeader = ({
  children,
  className,
  currentSort,
  onClick,
  sortKey,
}: Props): JSX.Element => {
  if (!onClick) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Button appearance="link" className={className} onClick={onClick}>
      <span>{children}</span>
      {currentSort && currentSort.key === sortKey && (
        <Icon
          name={
            currentSort.direction === "ascending"
              ? "chevron-up"
              : "chevron-down"
          }
        />
      )}
    </Button>
  );
};

export default TableHeader;
