import { Card, VStack, Text, HStack, Button } from "@chakra-ui/react";
import type { Skill } from "../pages/StudentPages/AddSkill";
import type { addCert } from "../pages/StudentPages/AddCert";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
import DrawerComponent from "./DrawerComponent";
export interface ApplicantData {
  employee_name: string;
  application_status: string;
  employee_address: string;
  role: string;
  institutes: string[];
  skills: Skill[];
  workexps: workExp[];
  certifications: addCert[];
}

interface PendingProps {
  data: ApplicantData[];
  accept: (employee_address: string) => void;
  reject: (employee_address: string) => void;
}

const PendingEmployees = ({ data, accept, reject }: PendingProps) => {
  return (
    <Card.Root>
      <Card.Body>
        {data.map((item, index) =>
          item.employee_address !==
          "0x0000000000000000000000000000000000000000" ? (
            <VStack key={index}>
              <HStack>
                <Text>Name:</Text>
                <Text>{item.employee_name}</Text>
              </HStack>
              <HStack>
                <Text>Address:</Text>
                <Text>{item.employee_address}</Text>
              </HStack>
              <DrawerComponent
                skillData={item.skills}
                workExpData={item.workexps}
                certData={item.certifications}
                trigger={<Button>Show Info</Button>}
              />
              <HStack>
                <Button
                  onClick={() => {
                    accept(item.employee_address);
                  }}
                >
                  Accept
                </Button>
                <Button
                  onClick={() => {
                    reject(item.employee_address);
                  }}
                >
                  Reject
                </Button>
              </HStack>
            </VStack>
          ) : (
            <></>
          )
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default PendingEmployees;
