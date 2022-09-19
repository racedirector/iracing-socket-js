import React from "react";
import {
  Accordion,
  Button,
  Box,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  Camera as CameraType,
  CameraGroup as CameraGroupType,
  CameraInfo as CameraInfoType,
} from "@racedirector/iracing-socket-js";

interface CameraProps extends CameraType {
  onPress: (cameraNumber: number) => void;
}

const Camera: React.FC<CameraProps> = ({
  CameraName: name,
  CameraNum: number,
  onPress,
}) => (
  <AccordionPanel>
    <Button
      colorScheme="teal"
      onClick={() => {
        onPress(number);
      }}
    >{`Name: ${name}`}</Button>
  </AccordionPanel>
);

interface CameraGroupProps extends CameraGroupType {
  onCameraSelect: (groupNumber: number, cameraNumber: number) => void;
}

const CameraGroup: React.FC<CameraGroupProps> = ({
  GroupName: groupName,
  GroupNum: groupNumber,
  Cameras: cameras,
  onCameraSelect,
}) => (
  <AccordionItem>
    <h2>
      <AccordionButton>
        <Box flex="1" textAlign="left">
          {groupName}
        </Box>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    {cameras.map((props) => (
      <Camera
        {...props}
        onPress={(cameraNumber) => {
          onCameraSelect(groupNumber, cameraNumber);
        }}
      />
    ))}
  </AccordionItem>
);

export interface CamerasProps extends Partial<CameraInfoType> {
  onCameraSelect: CameraGroupProps["onCameraSelect"];
}

export const Cameras: React.FC<CamerasProps> = ({
  Groups: groups = [],
  onCameraSelect,
}) => {
  return (
    <>
      <h1>Cameras</h1>
      <Accordion allowToggle>
        {groups.map((props) => (
          <CameraGroup {...props} onCameraSelect={onCameraSelect} />
        ))}
      </Accordion>
    </>
  );
};

export default Cameras;
