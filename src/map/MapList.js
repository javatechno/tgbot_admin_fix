import React from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import {Button, IconButton, ListItem, ListItemButton, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MapForm from "./MapForm";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";


type tileType = {
    alliance: string,
    uuid: string,
    photoUrls: [],
    tileName: string,
    description: string,
    income: integer,
    id: integer
};

const alliances = [
    {
        value: 0,
        label: 'CHAOS',
    },
    {
        value: 1,
        label: 'ORDER',
    }]
export default class MapList extends React.Component {
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
            //фильтрация по по альянсу
            allianceFilter: 'CHAOS',
            selectedIndex: {},
            loading: false,
            lastItemIndex: 0,
        };
    }

    //Ресетится дата, пришедшая в ответ на клик формы.
    refreshListData() {
        const that = this;
        console.log("current allianceFilter  value = " + JSON.stringify(this.state.allianceFilter))

        axios.get(
            'https://bot2-production-a1b8.up.railway.app:8080/tile/list',
            {
                headers:
                    {
                        'Content-Type': 'application/json'
                    },
                params: {
                    allianceFilter: this.state.allianceFilter
                }
            }
        )
            .then(function (response) {
                if ((Array.isArray(response.data) && response.data.length > 0) && (response.data !== null && response.data !== undefined)) {
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
            'https://bot2-production-a1b8.up.railway.app:8080/tile/list',
            {
                headers:
                    {
                        'Content-Type': 'application/json'
                    },
                params: {
                    allianceFilter: this.state.allianceFilter
                }
            }
        )
            .then(function (response) {
                if ((Array.isArray(response.data) && response.data.length > 0)) {
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

    handleFilterChange = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        value: number,
    ) => {
        console.log("Что сетим: " + JSON.stringify(value.props.children))
        await this.setState({allianceFilter: value.props.children})
        console.log(JSON.stringify(this.state.allianceFilter))
        this.refreshListData()
    }
    addItem = async () => {
        const newItem: tileType = {
            photoUrls: [],
            alliance: this.state.allianceFilter,
            uuid: null,
            tileName: null,
            description: null,
            income: 0,
            id: 0,
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
            'https://bot2-production-a1b8.up.railway.app:8080/tile/delete',
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
            if (this.state.allianceFilter === 0 || this.state.allianceFilter === null || this.state.allianceFilter === undefined) {
                return arr // Don't filter
            }
            console.log(JSON.stringify(arr.filter(item => item['alliance'] === this.state.allianceFilter)))
            return arr.filter(item => item['alliance'] === this.state.allianceFilter) // Filter when type is other than "all"
        }

        console.log("Внутренние обхекты: " + JSON.stringify(this.state.elements))
        console.log("Фильтр: " + JSON.stringify(this.state.allianceFilter))
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
                        <ListItemText primary={JSON.stringify(passedItem[1].tileName)}/>
                    </ListItemButton>
                </ListItem>)
    }

    render() {
        //рендерится список полученных elements
        return (
            <Box sx={{width: '100%', overflowY: 'scroll'}}>
                <Grid container spacing={2}>
                    <Grid item xs={2} sx={{maxHeight: '92vh', overflowY: 'scroll'}}>
                        <Select label={alliances[0]['label']} multiline={true} select={true}
                                SelectProps={{native: true}}
                                sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                onChange={this.handleFilterChange}
                                defaultValue={alliances[0].value}>
                            {alliances.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="outlined" onClick={() => this.addItem()}> Добавить элемент </Button>
                        <List sx={{width: '100%', maxHeight: '100%', overflowY: 'scroll'}} component="nav"
                              aria-label="secondary mailbox folder">
                            {this.renderItems()}
                        </List>
                    </Grid>
                    <Grid item xs={9}>
                        <MapForm changeStateOnButton={this.refreshListData.bind(this)}
                                 ref={this.dynamicForm}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
MapList.defaultProps = {
    allianceFilter: 0
};
