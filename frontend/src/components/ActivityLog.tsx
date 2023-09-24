import { List, ListIcon, ListItem, Card, CardBody } from "@chakra-ui/react";
import { IoFootsteps } from "react-icons/io5";

const ActivityLog = () => {
  return (
    <Card w="full" rounded={"20px"}>
      <CardBody fontSize={"xl"}>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Student Miho has joined your StudySplach group!
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Student Maho has finished the group!
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            There are two new nothications!
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export default ActivityLog;
