import { Card, Timeline } from "@chakra-ui/react";
import { useState, useContext, useEffect } from "react";
import { LuPackage, LuCheck } from "react-icons/lu";
import { MdOutlinePendingActions } from "react-icons/md";
import { Web3Context } from "../Web3ContextProvider";

interface TimelineEvent {
  title: string;
  description: string;
  icon: any;
  status: string;
}
const getColor = (status: string) =>
  status === "completed" ? "white" : "gray";
const getTextColor = (status: string) => {
  return status === "completed" ? "Black" : "gray";
};
const TimeLine = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const { getStatus } = useContext(Web3Context);

  useEffect(() => {
    const fetchStatusAndSetTimeline = async () => {
      const account = sessionStorage.getItem("account");
      if (!account) return;

      await getStatus(account); // fetches status and stores in sessionStorage

      const Status = JSON.parse(sessionStorage.getItem("Status") || "{}");

      const events: TimelineEvent[] = [
        {
          title: "Registerd To Pending",
          description: Status?.registrationDate || "Not available",
          icon: MdOutlinePendingActions,
          status: "completed",
        },
        {
          title: "Waiting For Verification By MOE",
          description: Status?.verificationDate || "Not available",
          icon: LuPackage,
          status: "completed",
        },
        {
          title: "Account Verified",
          description: Status?.isVerified ? "Verified" : "Pending",
          icon: LuCheck,
          status: Status?.isVerified ? "completed" : "pending",
        },
      ];

      setTimelineEvents(events);
    };

    fetchStatusAndSetTimeline();
  }, []);

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
                    <IconComponent />
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
