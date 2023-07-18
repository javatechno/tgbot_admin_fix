import './App.css';
import MagicList from './magic/MagicList.js';
import NewsList from './news/NewsList.js';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React from 'react';
import UnitList from "./Unit/UnitList";
import ArtifactList from "./Artifact/ArtifactList";
import MapList from "./map/MapList";


const Item = styled(Paper)(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  maxHeight: '100vh',
  minWidth: '100%',
  maxWidth: '100%',
  overflowY: 'scroll',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));


//Получение данных для выпадающего списка
function getMoviesFromApiAsync() {
  fetch('http://facebook.github.io/react-native/movies.json')
      .then(response => response.json())
      .then((jsonData) => {
        // jsonData is parsed json object received from url
        console.log(jsonData)
      })
      .catch((error) => {
        // handle your errors here
        console.error(error)
      })
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}


function App() {
  /*Переключение вкладок*/
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
      // контейнер всего окна

      <Box>
        <Tabs onChange={handleChange} value={value}>
          <Tab label="Магия"/>
          <Tab label="Новости"/>
          <Tab label="Отряды"/>
          <Tab label="Артефакты"/>
          <Tab label="Карта"/>
        </Tabs>
        {value === 0 && <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{maxHeight: '90vh', overflowY: 'hidden'}}>
              <MagicList>
              </MagicList>
            </Item>
          </Grid>
        </Grid>}
        {value === 1 && <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{maxHeight: '90vh', overflowY: 'hidden'}}>
              <NewsList>
              </NewsList>
            </Item>
          </Grid>
        </Grid>}
        {value === 2 && <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{maxHeight: '90vh', overflowY: 'hidden'}}>
              <UnitList>
              </UnitList>
            </Item>
          </Grid>
        </Grid>}
        {value === 3 && <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{maxHeight: '90vh', overflowY: 'hidden'}}>
              <ArtifactList>
              </ArtifactList>
            </Item>
          </Grid>
        </Grid>}
        {value === 4 && <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item sx={{maxHeight: '90vh', overflowY: 'hidden'}}>
              <MapList>
              </MapList>
            </Item>
          </Grid>
        </Grid>}
      </Box>
  );
}

export default App;