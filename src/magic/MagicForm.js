import React from 'react';
import {Button, FormControl, FormLabel, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import InteractiveElementInfo from "./MagicInteractiveElement";
import axios from "axios";


const alliances = [
    {
        value: null,
        label: 'Не задан',
    },
    {
        value: 0,
        label: 'CHAOS',
    },
    {
        value: 1,
        label: 'ORDER',
    }]

const levelz = [
    {
        value: null,
        label: 'Не установлен',
    },
    {
        value: 1,
        label: 'Первый',
    },
    {
        value: 2,
        label: 'Второй',
    },
    {
        value: 3,
        label: 'Третий',
    },
    {
        value: 4,
        label: 'Четвертый',
    }]
export default class CustomDynamicForm extends React.Component {
    constructor(props) {
        super(props);
        this.interactiveElement = React.createRef();
        this.state = {
            values: {},
            errors: {}
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleNewData(passedValues, passedIndex, passedType) {
        await this.setState({
            values: passedValues,
            index: passedIndex

        })
        console.log("PASSED DATA: " + JSON.stringify(passedValues));
        console.log("PASSED INDEX: " + JSON.stringify(passedIndex));

        await this.interactiveElement.current.handlePassedData(passedValues)
    }

    createUI() {
        return Object.entries(this.state.values)
            // .filter(([k, _]) => (k !== 'uuid') && (k !== 'id'))
            .map(([key, value], i) => {
                    if (key === 'type') {
                        return;
                    }
                    if (key === 'uuid' || key === 'id') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={key} value={value} multiline={true}
                                       disabled={true}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}>
                            </TextField>
                        </div>
                    }
                    if (key === 'level') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Уровень заклинания'}
                                       value={this.state.values['level']} multiline={true} select={true}
                                       SelectProps={{native: true,}}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}>
                                {levelz.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </div>
                    }
                    if (key === 'alliance' && value !== null && value !== '') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Альянс'} multiline={true} select={true}
                                       SelectProps={{native: true,}}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}>
                                <option defaultSelected={true} value={value}>{value}</option>
                                {alliances.map((option) => {
                                    if (JSON.stringify(option.label) !== JSON.stringify(value)) {
                                        return <option key={option.label} value={option.label}>
                                            {option.label}
                                        </option>
                                    }
                                })}
                            </TextField>
                        </div>
                    } else if (key === 'alliance') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Альянс'} multiline={true} select={true}
                                       SelectProps={{native: true,}}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}>
                                <>
                                    <option></option>
                                    {alliances.map((option) => {
                                        return <option key={option.label} value={option.label}>
                                            {option.label}
                                        </option>
                                    })}
                                </>
                            </TextField>
                        </div>
                    } else if (key === 'spellName') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Название'} multiline={true} value={value}
                                       sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    } else if (key === 'itemDescription') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Описание'} multiline={true} value={value}
                                       sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    } else if (key === 'photoUrls') {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={'Ссылки на фото'} multiline={true}
                                       value={value} sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    } else if (value != null) {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} label={key} multiline={true} value={value}
                                       sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    } else {
                        return <div key={i}>
                            <TextField InputLabelProps={{shrink: true}} multiline={true} label={key} value=''
                                       sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    }
                }
            )
    }


    handleChange(key, index, event) {
        console.log("selected: " + event.target.key)
        console.log('selected: ' + event.target.value)
        this.state.values[key] = event.target.value
        console.log('set: ' + this.state.values[key])
        const targetValue = this.state.values;
        console.log('target value now: ' + JSON.stringify(targetValue))
        this.setState({values: targetValue});
        console.log('new values: ' + JSON.stringify(targetValue))
        this.interactiveElement.current.handlePassedData(this.state.values)
    }

    handleSubmit = event => {
        const submitData = this.state.values
        event.preventDefault();
        // if(type ==='submit') {
        axios.post(
            'https://bot2-production-a1b8.up.railway.app:8080/magic/update',
            // НЕ ПИСАТЬ НИКАКИХ ПЕРЕМЕННЫХ, чтобы не добавлять теги.
            this.state.values,
            {headers: {'Content-Type': 'application/json'}}
        ).then(response => {
            this.props.changeStateOnButton(response.data) // would work
        })
    }

    addItem = async () => {
        const newItem = structuredClone(this.state.elements[0])
        console.log("before mapping: " + JSON.stringify(newItem))
        for (var key in newItem) newItem[key] = ""
        console.log("addedItem: " + JSON.stringify(newItem));
        this.state.elements.push(newItem);
        await this.setState({
            //для повторного рендера списка сетим статус: 'последний элемент такой-то'
            lastItemIndex: this.state.elements.length - 1,
        })
    };


    // handleDelete = async (event) => {
    //     event.preventDefault();
    //     const submitData = structuredClone(this.state.values)
    //     console.log("Data to delete: " + JSON.stringify(submitData))
    //      await axios.post(
    //         'https://bot2-production-a1b8.up.railway.app:8080/magic/delete',
    //         // НЕ ПИСАТЬ НИКАКИХ ПЕРЕМЕННЫХ, чтобы не добавлять теги.
    //         submitData,
    //         {headers: {'Content-Type': 'application/json'}}
    //     ).then(response => {
    //         this.props.changeStateOnButton(response.data) // would work
    //     })
    // };

    render() {

        return (
            <Box sx={{width: '100%', maxHeight: '100%', bgcolor: 'background.paper'}}>
                <Grid container spacing={2} sx={{align: "center", justify: "center"}}>
                    <Grid item xs={8} sx={{maxHeight: '80vh', overflowY: 'scroll'}}>
                        <FormControl sx={{width: '100%'}}>
                            <FormLabel sx={{mb: 3}}>Редактирование элемента </FormLabel>
                            <form onSubmit={this.handleSubmit}>
                                {this.createUI()}
                                <Button variant="outlined" color="secondary" type="submit">Внести изменения</Button>
                            </form>

                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <InteractiveElementInfo ref={this.interactiveElement}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
