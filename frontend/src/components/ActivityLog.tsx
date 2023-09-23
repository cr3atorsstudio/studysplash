import { List, ListIcon, ListItem, Card, CardBody } from "@chakra-ui/react";
import { IoFootsteps } from "react-icons/io5";

const ActivityLog = () => {
  return (
    <Card w="full" rounded={"20px"} h={"200px"}>
      <CardBody fontSize={"xl"}>
        <List spacing={3}>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Assumenda, quia temporibus eveniet a libero incidunt suscipit
          </ListItem>
          <ListItem>
            <ListIcon as={IoFootsteps} color="green.500" />
            Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
          </ListItem>
        </List>
      </CardBody>
    </Card>
  );
};

export default ActivityLog;
