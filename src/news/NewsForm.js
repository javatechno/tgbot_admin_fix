import React from 'react';
import {Button, FormControl, FormLabel, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import NewsInteractiveElement from "./NewsInteractiveElement";
const levelz = [
    {
        value: 1,
        label: 'Первый ход',
    },
    {
        value: 2,
        label: 'Второй ход',
    },
    {
        value: 3,
        label: 'Третий ход',
    },
    {
        value: 4,
        label: 'Четвертый ход',
    },
    {
        value: 5,
        label: 'Пятный ход',
    },
    {
        value: 6,
        label: 'Шестой ход',
    },
    {
        value: 7,
        label: 'Седьмой ход',
    },
    {
        value: 8,
        label: 'Восьмой ход',
    }]

const alliances = [
    {
        value: 0,
        label: 'CHAOS',
    },
    {
        value: 1,
        label: 'ORDER',
    }]
export default class NewsForm extends React.Component {
    constructor(props) {
        super(props);
        this.interactiveElement = React.createRef();
        this.state = {
            values: {},
            errors: {}
        };
        // this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleNewData(passedValues, passedIndex) {
        await this.setState({
            values: passedValues,

        })
        console.log("PASSED DATA: "  +JSON.stringify(passedValues));
        await this.interactiveElement.current.handlePassedData(passedValues)
    }

    createUI() {
        return Object.entries(this.state.values)
            .filter(([k, _]) => (k !== 'Дата'))
            .map(([key, value], i) => {
                    if (key === 'type') {
                        return;
                    }
                    if (key === 'uuid' || key === 'id') {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} label={key} value={value} multiline={true} disabled={true}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}>
                            </TextField>
                        </div>
                    }
                if (key === 'round' && value !== null && value !== '') {
                    return <div key={i}>
                        <TextField InputLabelProps={{ shrink: true }} label={'Ход'} value={value} multiline={true} disabled={true}
                                   sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}>
                        </TextField>
                    </div>
                }
                else if (key === 'round') {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} label={'Ход'} multiline={true} select={true} SelectProps={{native: true,}}
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
                        <TextField InputLabelProps={{ shrink: true }} label={'Альянс'} value={value} multiline={true} disabled={true}
                                   sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}>
                        </TextField>
                    </div>
                }  else if (key === 'alliance') {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }}  label={'Альянс'} multiline={true} select={true} SelectProps={{native: true,}}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}>
                                <><option></option>
                                    {alliances.map((option) => {
                                        return <option key={option.label} value={option.label}>
                                            {option.label}
                                        </option>
                                    })}
                                </>
                            </TextField>
                        </div>
                    }
                    else if (key === 'createdDate' && value != null) {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} disabled={true} type = "date" label={'Дата новости'} multiline={true} defaultValue={Date(value)} sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    }
                    else if (key === 'createdDate' && value === null) {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} InputLabelProps={{ shrink: true }} disabled={true} type = "date" label={'Дата новости'} multiline={true} value={new Date()} sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    }
                    else if (value != null) {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} label={key} multiline={true} value={value} sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    } else {
                        return <div key={i}>
                            <TextField InputLabelProps={{ shrink: true }} multiline={true} label={key} value='' sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    }
                }
            )
    }


    handleChange(key, index, event) {
        console.log("selected: "+event.target.key)
        console.log('selected: ' +event.target.value)
        this.state.values[key] = event.target.value
        console.log('set: ' +this.state.values[key])
        const targetValue = this.state.values;
        console.log('target value now: ' +JSON.stringify(targetValue))
        this.setState({values: targetValue});
        console.log('new values: ' +JSON.stringify(targetValue))
        this.interactiveElement.current.handlePassedData(this.state.values)
    }

    addClick() {
        this.setState(prevState => ({values: [...prevState.values, '']}))
    }

    removeClick(key, i) {

        let newValues = {...this.state.values};
        delete newValues[key]
        const constValues = newValues

        this.setState({values: newValues});
        // this.setState({constValues})

    }

    handleSubmit = event => {
        const submitData = this.state.values
        event.preventDefault();
        // if(type ==='submit') {
        axios.post(
            'https://bot2-production-a1b8.up.railway.app:8080/news/update',
            // НЕ ПИСАТЬ НИКАКИХ ПЕРЕМЕННЫХ, чтобы не добавлять теги.
            this.state.values,
            {headers: {'Content-Type': 'application/json'}}
        ).then(response => {
            this.props.changeStateOnButton(response.data) // would work
        })
    }

    render() {

        return (
            <Box sx={{width: '100%', maxHeight: '100%', bgcolor: 'background.paper'}}>
                <Grid container spacing={2} sx={{align: "center", justify: "center"}}>
                    <Grid item xs={8} sx={{ maxHeight: '80vh', overflowY: 'scroll'}}>
                        <FormControl sx={{width:'100%'}}>
                            <FormLabel sx={{mb: 3}}>Редактирование элемента </FormLabel>
                            <form onSubmit={this.handleSubmit}>
                                {this.createUI()}
                                <Button variant="outlined" color="secondary" type="submit">Внести изменения</Button>
                            </form>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <NewsInteractiveElement ref={this.interactiveElement}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
