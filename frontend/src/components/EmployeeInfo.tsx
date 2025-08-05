import {
  Avatar,
  Button,
  Card,
  HStack,
  Stack,
  Strong,
  Text,
} from "@chakra-ui/react";
import { LuCheck } from "react-icons/lu";
import type { ApplicantData } from "./PendingEmployees";
import DrawerComponent from "./DrawerComponent";
interface Props {
  data: ApplicantData;
}
const EmployeeInfo = ({ data }: Props) => {
  return (
    <Card.Root width="320px">
      <Card.Body>
        <HStack mb="6" gap="3">
          <Avatar.Root>
            <Avatar.Image src="https://images.unsplash.com/photo-1511806754518-53bada35f930" />
            <Avatar.Fallback name="Nate Foss" />
          </Avatar.Root>
          <Stack gap="0">
            <Text fontWeight="semibold" textStyle="sm">
              {data.employee_name}
            </Text>
            <Text color="fg.muted" textStyle="sm">
              {data.role}
            </Text>
          </Stack>
        </HStack>
        <Card.Description>
          <Strong color="fg">Address: </Strong>
          {data.employee_address}
        </Card.Description>
      </Card.Body>
      <Card.Footer>
        <DrawerComponent
          skillData={data.skills}
          workExpData={data.workexps}
          certData={data.certifications}
          trigger={
            <Button variant="subtle" colorPalette="blue" flex="1">
              <LuCheck />
              Show Info
            </Button>
          }
        />
      </Card.Footer>
    </Card.Root>
  );
};

export default EmployeeInfo;
