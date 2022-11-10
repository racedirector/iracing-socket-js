import React from "react";
import {
  EditablePreview,
  Flex,
  IconButton,
  Input,
  ButtonGroup,
  Editable,
  Tooltip,
  EditableInput,
  useEditableControls,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, SpinnerIcon } from "@chakra-ui/icons";

interface IRacingSocketConnectionInputControlsProps {
  onRefresh?: () => void;
}

const IRacingSocketConnectionInputControls: React.FC<
  IRacingSocketConnectionInputControlsProps
> = ({ onRefresh = () => {} }) => {
  const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
    useEditableControls();

  return isEditing ? (
    <ButtonGroup size="sm" spacing={2} mt={2}>
      <IconButton
        aria-label="Submit server address"
        icon={<CheckIcon />}
        backgroundColor="gray.500"
        {...getSubmitButtonProps()}
      />
      <IconButton
        aria-label="Cancel editing"
        backgroundColor="gray.500"
        icon={<CloseIcon boxSize={3} />}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <IconButton
      aria-label="Reload server "
      backgroundColor="gray.500"
      icon={<SpinnerIcon />}
      onClick={onRefresh}
    />
  );
};

export interface IRacingSocketConnectionInputProps
  extends IRacingSocketConnectionInputControlsProps {
  server?: string;
  onSubmit?: (server: string) => void;
}

export const IRacingSocketConnectionInput: React.FC<
  IRacingSocketConnectionInputProps
> = ({ server, onSubmit, onRefresh }) => {
  return (
    <Editable
      defaultValue={server}
      placeholder="iRacingBrowserApps/Kapps server host"
      isPreviewFocusable={true}
      selectAllOnFocus={false}
      onSubmit={onSubmit}
    >
      <Flex>
        <Tooltip label="Click to edit">
          <EditablePreview py={2} px={4} />
        </Tooltip>
        <Input py={2} px={4} as={EditableInput} />
        <IRacingSocketConnectionInputControls onRefresh={onRefresh} />
      </Flex>
    </Editable>
  );
};
