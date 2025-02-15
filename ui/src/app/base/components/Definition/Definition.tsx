import React from "react";

import { useId } from "app/base/hooks/base";

type CommonProps = {
  label: React.ReactNode;
};

type DescriptionProps =
  | {
      children?: never;
      description?: string;
    }
  | {
      children?: React.ReactNode;
      description?: never;
    };

type Props = CommonProps & DescriptionProps;

const Definition = ({ label, children, description }: Props): JSX.Element => {
  const id = useId();
  return (
    <div>
      <p className="u-text--muted" id={id}>
        {label}
      </p>
      {description ? (
        <p aria-labelledby={id}>{description}</p>
      ) : React.Children.toArray(children).length > 0 ? (
        React.Children.toArray(children).map(
          (child, i) =>
            child && (
              <p key={i} aria-labelledby={id}>
                {child}
              </p>
            )
        )
      ) : (
        <p>—</p>
      )}
    </div>
  );
};

export default Definition;
