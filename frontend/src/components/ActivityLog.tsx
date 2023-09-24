import { List, ListIcon, ListItem, Card, CardBody } from "@chakra-ui/react";
import { IoFootsteps } from "react-icons/io5";

const ActivityLog = () => {
  return (
    <Card w="full" rounded={"20px"} h={"200px"}>
      <CardBody fontSize={"xl"}>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Bob has enrolled in your course!{" "}
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            The next course is on 9/30!
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            You have a new chat message!
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export default ActivityLog;
