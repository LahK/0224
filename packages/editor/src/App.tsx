import React from "react";
import "./styles.css";
import DataSourceRegistry, { Profile, Article } from "./components/DataSource";
import DataCell from "./components/DataCell";
import DataList from "./components/DataList";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar, { AvatarProps } from "@mui/material/Avatar";
import Typography, { TypographyProps } from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

interface ItemProps {
  title: string;
  subtitle: string;
}
const Item: React.FC<ItemProps> = ({ title, subtitle }) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemText
        primary={title}
        secondary={
          <Typography
            sx={{ display: "inline" }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            {subtitle}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default function App() {
  return (
    <div className="App">
      <DataSourceRegistry plugins={[]}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <DataCell<Profile, AvatarProps>
            dataSource="profile"
            dataMapper={(dataSource) => ({
              src: dataSource?.data?.avatar,
              alt: dataSource?.data?.name,
              style: { marginRight: 8 }
            })}
            Component={Avatar}
          />
          <DataCell<Profile, TypographyProps>
            dataSource="profile"
            dataMapper={(dataSource) => ({
              variant: "body1",
              children: dataSource?.data?.name
            })}
            Component={Typography}
          />
        </Box>
        <List>
          <DataList<Article, ItemProps>
            dataSource="articles"
            dataMapper={(dataSource) => ({
              key: dataSource.data!.id,
              title: dataSource.data!.title,
              subtitle: dataSource.data!.content
            })}
            Component={Item}
          />
        </List>
      </DataSourceRegistry>
    </div>
  );
}
