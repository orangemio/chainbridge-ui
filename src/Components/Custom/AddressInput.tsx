import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import { makeStyles, createStyles, ITheme } from "@imploy/common-themes";
import {
  CheckboxInput,
  FormikTextInputProps,
  TextInput,
} from "@imploy/common-components";
import clsx from "clsx";
import { useField } from "formik";

const useStyles = makeStyles(({ constants }: ITheme) =>
  createStyles({
    root: {},
    input: {
      margin: 0,
      width: "100%",
    },
    label: {
      marginBottom: constants.generalUnit,
    },
    checkbox: {
      marginTop: constants.generalUnit * 3,
    },
  })
);

interface IAddressInput extends FormikTextInputProps {
  senderAddress: string;
  classNames?: {
    input?: string;
  };
}

const AddressInput: React.FC<IAddressInput> = ({
  classNames,
  senderAddress,
  className,
  inputVariant = "default",
  type = "text",
  placeholder,
  name,
  size,
  label,
  labelClassName,
  captionMessage,
  ...rest
}: IAddressInput) => {
  const classes = useStyles();
  const [field, meta, helpers] = useField(name);

  const [stored, setStored] = useState<string | undefined>();

  const toggleReceiver = useCallback(() => {
    if (stored === undefined) {
      setStored(field.value);
      helpers.setValue(senderAddress);
    } else {
      helpers.setValue(stored);
      setStored(undefined);
    }
  }, [helpers, field, senderAddress, stored, setStored]);

  useEffect(() => {
    // Used to ensure value if address changes for some reason
    if (stored && stored !== senderAddress) {
      setStored(senderAddress);
    }
  }, [senderAddress, stored]);

  return (
    <section className={clsx(classes.root, className)}>
      <div>
        <TextInput
          label={label ? label : field.name}
          inputVariant={inputVariant}
          disabled={stored !== ""}
          type={type}
          size={size}
          className={clsx(classNames?.input, classes.input)}
          labelClassName={clsx(labelClassName, classes.label)}
          name={field.name}
          value={field.value}
          placeholder={placeholder}
          captionMessage={
            meta.error ? `${meta.error}` : captionMessage && captionMessage
          }
          state={meta.error ? "error" : undefined}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            helpers.setValue(e.target?.value);
          }}
          {...rest}
        />
      </div>
      <div className={classes.checkbox}>
        <CheckboxInput
          label="I want to send funds to my address"
          value={stored !== undefined}
          onChange={() => toggleReceiver()}
        />
      </div>
    </section>
  );
};

export default AddressInput;