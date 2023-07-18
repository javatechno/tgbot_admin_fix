import React from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import {Button, IconButton, ListItem, ListItemButton} from "@mui/material";
import Box from "@mui/material/Box";
import {styled} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import UnitForm from "./UnitForm";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import List from "@material-ui/core/List";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

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

type UnitType = {
    alliance: string,
    uuid: string,
    photoUrls: [],
    unitName: string,
    unitSize: integer,
    unitCost: integer,
    totalSize: integer,
    isAvailable: boolean,
    isHired: boolean
}

export default class UnitList extends React.Component {
    constructor(props) {
        super(props);
        this.dynamicForm = React.createRef();
        this.state = {
            //сюда нужно засетить запрос
            elements: [],
            type: '',
            currentListItem: '',
            selectedIndexForm: {},
            showForm: false,
            //фильтрация по неделе, если не 0.
            selectedIndex: {},
            loading: false,
            lastItemIndex: 0,
        };
    }

    //Ресетится дата, пришедшая в ответ на клик формы.
    refreshListData() {
        const that = this;
            axios.get(
                'https://bot2-production-a1b8.up.railway.app:8080/unit/list',
                {
                    headers:
                        {
                            'Content-Type': 'application/json'
                        }
                }
            )
                .then(function (response) {
                    if((Array.isArray(response.data) && response.data.length>0) && (response.data !== null && response.data !== undefined)) {
                        that.setState({
                            elements: JSON.parse(JSON.stringify(response.data)),
                        });
                        console.log("PASSED DATA:" + JSON.stringify(response.data));
                        console.log("PASSED TYPE:" + JSON.parse(JSON.stringify(response.data))[0]['type']);
                    } else {
                        that.setState({
                            elements: []

                        });
                    }
                });
    };

    // Вот это вызывать чтобы тащить инфу с бэка
    componentDidMount() {
        const that = this;
        axios.get(
            'https://bot2-production-a1b8.up.railway.app:8080/unit/list',
            {
                headers:
                    {
                        'Content-Type': 'application/json'
                    }
            }
        )
            .then(function (response) {
                if((Array.isArray(response.data) && response.data.length>0) && (response.data !== null && response.data !== undefined)) {
                    that.setState({
                        elements: JSON.parse(JSON.stringify(response.data)),
                    });
                    console.log("PASSED DATA:" + JSON.stringify(response.data));
                    console.log("PASSED TYPE:" + JSON.parse(JSON.stringify(response.data))[0]['type']);
                } else {
                    that.setState({
                        elements: []

                    });
                }
            });

    }


    handleListItemClick = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        passedItem: Object,
    ) => {
        // const index = getIndex(passedItem[1])
        console.log("что в эвенте:" + passedItem[1])
        await this.dynamicForm.current.handleNewData(passedItem[1])
    };

    addItem = async () => {
        const newItem: UnitType = {
            alliance: null,
            uuid: null,
            unitName: '',
            unitSize: 0,
            unitCost: 0,
            totalSize: 0,
            isAvailable: false,
            isHired: false,
            photoUrls: []
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
            'https://bot2-production-a1b8.up.railway.app:8080/unit/delete',
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
        console.log("values array = ", Object.entries(this.state.elements));
        const filteredObjects = (arr) => {
            if (this.state.weekFilter === 0 || this.state.weekFilter === null || this.state.weekFilter === undefined) {
                return arr // Don't filter
            }
            console.log(JSON.stringify(arr.filter(item => item['Ход'] === this.state.weekFilter)))
            return arr.filter(item => item['Ход'] === this.state.weekFilter) // Filter when type is other than "all"
        }

        console.log("Внутренние обхекты: " + JSON.stringify(this.state.elements))
        console.log("Фильтр: " + JSON.stringify(this.state.weekFilter))
        console.log("Фильтрованные данные: " + JSON.stringify(filteredObjects(this.state.elements)))
        return Object.entries(filteredObjects(this.state.elements))
            .map((passedItem, index) =>
                <ListItem key={index} secondaryAction={
                    <IconButton onClick={(event) => this.handleDelete(event, index)} edge="end" aria-label="delete">
                        <DeleteIcon/>
                    </IconButton>
                }>
                    <ListItemButton
                        onClick={(event) => this.handleListItemClick(event, passedItem)}
                    >
                        <ListItemIcon>
                            <InboxIcon/>
                        </ListItemIcon>
                        <ListItemText primary={JSON.stringify(passedItem[1]['unitName'])}/>
                    </ListItemButton>
                </ListItem>)
    }

    render() {
        //рендерится список полученных elements
        return (
            <Box sx={{width: '100%', overflowY: 'scroll'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2} sx={{maxHeight: '92vh', overflowY: 'scroll'}}>
                        <Button variant="outlined" onClick={() => this.addItem()}> Добавить элемент </Button>
                        <List sx={{width: '100%', maxHeight: '100%', overflowY: 'scroll'}} component="nav"
                              aria-label="secondary mailbox folder">
                            {this.renderItems()}
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <UnitForm changeStateOnButton={this.refreshListData.bind(this)}
                                  ref={this.dynamicForm}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}

