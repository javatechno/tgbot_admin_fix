import React from 'react';

import InboxIcon from '@mui/icons-material/Inbox';
import {Button, IconButton, ListItem, ListItemButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CustomDynamicForm from "./MagicForm";
import axios from "axios";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";

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
var config = {
    headers: {'Access-Control-Allow-Origin': '*'}
};

type MagicType = {
    photoUrls: [],
    uuid: string,
    alliance: string,
    spellName: string,
    itemDescription: string,
    level: integer
}

export default class MagicList extends React.Component {
    constructor(props) {
        super(props);
        this.dynamicForm = React.createRef();
        this.state = {
            //сюда нужно засетить запрос
            elements: [],
            currentListItem: '',
            selectedIndexForm: {},
            showForm: false,
            selectedIndex: {},
            loading: false,
            lastItemIndex: 0,
        };
    }

    //Ресетится дата, пришедшая в ответ на клик формы.
    refreshListData() {
        const that = this;
        axios.get(
            'https://bot2-production-a1b8.up.railway.app:8080/magic/list',
            {
                headers:
                    {
                        'Content-Type': 'application/json'
                    }
            }
        )
            .then(function (response) {
                that.setState({
                    elements: JSON.parse(JSON.stringify(response.data))
                });
                console.log("PASSED DATA:" + JSON.stringify(response.data));
                console.log("PASSED TYPE:" + JSON.parse(JSON.stringify(response.data))[0]['type']);
            });

    };

    // Вот это вызывать чтобы тащить инфу с бэка
    componentDidMount() {
        const that = this;
        axios.get(
            'https://bot2-production-a1b8.up.railway.app:8080/magic/list',
            {
                headers:
                    {
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin" : "*"
                    }
            }
        )
            .then(function (response) {
                if((Array.isArray(response.data) && response.data.length>0) && (response.data !== null && response.data !== undefined)) {
                    that.setState({
                        elements: JSON.parse(JSON.stringify(response.data)),
                        type: JSON.parse(JSON.stringify(response.data))['type'],
                    });
                    console.log("PASSED DATA:" + JSON.stringify(response.data));
                    console.log("PASSED TYPE:" + JSON.parse(JSON.stringify(response.data))[0]['type']);
                }
            });
    }


    // componentDidUpdate(prevProps){
    //     if(prevProps!== this.props.elements)
    //         this.setState({ elements : this.props.elements }) //everytime foo changes update the state
    // }
    handleListItemClick = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        // await this.setState({
        //     selectedIndexForm: index,
        //     currentListItem: this.props.elements[index],
        //     selectedIndex: index,
        //     showForm: true
        // });
        // console.log("DATA: "  +JSON.stringify(this.state.currentListItem));
        await this.dynamicForm.current.handleNewData(this.state.elements[index], index)
    };

    addItem = async () => {
        const newItem: MagicType = {
            photoUrls: [],
            uuid: null,
            alliance: null,
            spellName: '',
            itemDescription: null,
            level: 0
        };
        console.log("before mapping: " + JSON.stringify(newItem))
        await this.setState({
            elements: [...this.state.elements, newItem]
        })
    };

    handleDelete = async (event, index) => {
        const submitData = structuredClone(this.state.elements[index])
        console.log("Data to delete: " + JSON.stringify(submitData))
         await axios.post(
            'https://bot2-production-a1b8.up.railway.app:8080/magic/delete',
            // НЕ ПИСАТЬ НИКАКИХ ПЕРЕМЕННЫХ, чтобы не добавлять теги.
             submitData,
            {headers: {'Content-Type': 'application/json'}}
        ).then(response => {
            this.refreshListData()// would work
        })
        event.preventDefault();
    };

    renderItems = () => {
        console.log("keys array = ", Object.keys(this.state.elements));

        console.log("values array = ", Object.values(this.state.elements));
        // console.log("values array = ", Object.entries(this.state.elements)[0].id);

        return Object.entries(this.state.elements)
            .filter(entry => entry !== undefined)
            .map((passedItem, index) =>
                <ListItem key={index} secondaryAction={
                    <IconButton onClick = {(event) =>this.handleDelete(event, index)} edge="end" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                }>
                    <ListItemButton
                        onClick={(event) => this.handleListItemClick(event, index)}
                    >
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={JSON.stringify(passedItem[1]['spellName'])}/>
                    </ListItemButton>
                </ListItem>
    )
    }

    render() {
        //рендерится список полученных elements
        return (
            <Box sx={{width: '100%', overflowY: 'scroll'}}>
                <Grid container spacing={2}>
                    <Grid item xs={3} sx={{maxHeight: '92vh', overflowY: 'scroll'}}>
                        <Button variant="outlined" onClick={() => this.addItem()}> Добавить элемент </Button>
                        <List sx={{width: '100%', maxHeight: '100%', overflowY: 'scroll'}} component="nav"
                              aria-label="secondary mailbox folder">
                            {this.renderItems()}
                        </List>
                    </Grid>
                    {/*Не ресетится значение элемента подаваемого сюда по клику, только по рефрешу страницы*/}
                    <Grid item xs={9}>
                        <CustomDynamicForm changeStateOnButton={this.refreshListData.bind(this)}
                                           ref={this.dynamicForm}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}