import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/react";

type FormValues = {
  host: string;
  port: string;
};

export interface SocketConnectionFormProps extends Partial<FormValues> {
  connecting?: boolean;
  onSubmit: SubmitHandler<FormValues>;
}

export const SocketConnectionForm: React.FC<SocketConnectionFormProps> = ({
  connecting = false,
  onSubmit,
  host = undefined,
  port = undefined,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.host || !!errors.port}>
        <FormLabel htmlFor="host">Host</FormLabel>
        <Input
          id="host"
          placeholder="localhost"
          value={host}
          {...register("host", { required: true })}
        />
        <FormErrorMessage>
          {errors.host && errors.host.message}
        </FormErrorMessage>

        <FormLabel htmlFor="port">Port</FormLabel>
        <Input
          id="port"
          placeholder="8182"
          value={port}
          {...register("port", { required: true })}
        />
        <FormErrorMessage>
          {errors.port && errors.port.message}
        </FormErrorMessage>
      </FormControl>

      <Button
        colorScheme="teal"
        isLoading={isSubmitting || connecting}
        type="submit"
      >
        Submit
      </Button>
    </form>
  );
};

export default SocketConnectionForm;
