import { Card, Text, Timeline } from "@chakra-ui/react";
import { LuCheck, LuPackage } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";

const timelineEvents = [
  {
    title: "Registerd To Pending",
    description: "18th May 2021",
    icon: MdOutlinePendingActions,
    status: "completed",
  },
  {
    title: "Waiting For Verification By MOE",
    description: "18th May 2021",
    icon: LuPackage,
    status: "completed",
  },
  {
    title: "Account Verified",
    description: "20th May 2021, 10:30am",
    icon: LuCheck,
    status: "pending",
  },
];
const getColor = (status: string) =>
  status === "completed" ? "white" : "gray";
const getTextColor = (status: string) => {
  return status === "completed" ? "Black" : "gray";
};

const TimeLine = () => {
  const latestCompleted = [...timelineEvents]
    .reverse()
    .find((event) => event.status === "completed");
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Your Current Status</Card.Title>
        <Card.Description>{latestCompleted?.title}</Card.Description>
      </Card.Header>
      <Card.Body>
        <Timeline.Root maxW="400px">
          {timelineEvents.map((event, idx) => {
            const IconComponent = event.icon;
            return (
              <Timeline.Item key={idx}>
                <Timeline.Connector>
                  <Timeline.Separator />
                  <Timeline.Indicator color={getColor(event.status)}>
                    <IconComponent></IconComponent>
                  </Timeline.Indicator>
                </Timeline.Connector>
                <Timeline.Content>
                  <Timeline.Title color={getTextColor(event.status)}>
                    {event.title}
                  </Timeline.Title>
                  <Timeline.Description>
                    {event.description}
                  </Timeline.Description>
                </Timeline.Content>
              </Timeline.Item>
            );
          })}
        </Timeline.Root>
      </Card.Body>
    </Card.Root>
  );
};
export default TimeLine;
