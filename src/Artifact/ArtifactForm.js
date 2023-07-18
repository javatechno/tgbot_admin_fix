import React from 'react';
import {Button, FormControl, FormLabel, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import axios from "axios";
import ArtifactInteractiveElement from "./ArtifactInteractiveElement";

const alliances = [
    {
        value: 0,
        label: 'CHAOS',
    },
    {
        value: 1,
        label: 'ORDER',
    }]

const boolMapping = [
    {
        value: false,
        label: 'Нет',
    },
    {
        value: true,
        label: 'Да',
    },
    {
        value: null,
        label: 'Нет',
    }]
export default class ArtifactForm extends React.Component {
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
        console.log("PASSED DATA: " + JSON.stringify(passedValues));
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
                           <TextField InputLabelProps={{ shrink: true }}  label={key} value={value} multiline={true} disabled={true}
                                       sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}>
                            </TextField>
                        </div>
                    }
                    if (key === 'isResearched') {
                        return<TextField InputLabelProps={{ shrink: true }}  label='исследован' value={this.state.values[key]} multiline={true} select={true}
                                          SelectProps={{native: true,}}
                                          sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                          onChange={this.handleChange.bind(this, key, i)}>
                            {boolMapping.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    }
                    if (key === 'isAvailable') {
                        return<TextField InputLabelProps={{ shrink: true }}  label='Доступен' value={this.state.values[key]} multiline={true} select={true}
                                          SelectProps={{native: true,}}
                                          sx={{mb: 3, whiteSpace: "initial"}} fullWidth={true}
                                          onChange={this.handleChange.bind(this, key, i)}>
                            {boolMapping.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    }
                    if (key === 'alliance' && value !== null && value !== '') {
                        return <div key={i}>
                           <TextField InputLabelProps={{ shrink: true }}  label={'Альянс'} multiline={true} select={true} SelectProps={{native: true,}}
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
                           <TextField InputLabelProps={{ shrink: true }}  label={'Альянс'} multiline={true} select={true} SelectProps={{native: true,}}
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
                    } else if (key === 'description') {
                        return <div key={i}>
                           <TextField InputLabelProps={{ shrink: true }}  label={'Описание'} multiline={true} value={value} sx={{mb: 3, whiteSpace: "initial"}}
                                       fullWidth={true}
                                       onChange={this.handleChange.bind(this, key, i)}/>
                        </div>
                    }
                if (key === 'photoUrls') {
                    return <div key={i}>
                       <TextField InputLabelProps={{ shrink: true }}  label={'Ссылки на фото'} multiline={true} value={value} sx={{mb: 3, whiteSpace: "initial"}}
                                   fullWidth={true}
                                   onChange={this.handleChange.bind(this, key, i)}/>
                    </div>
                }
                if (key === 'name') {
                    return <div key={i}>
                       <TextField InputLabelProps={{ shrink: true }}  label={'Название'} multiline={true} value={String(value)} sx={{mb: 3, whiteSpace: "initial"}}
                                   fullWidth={true}
                                   onChange={this.handleChange.bind(this, key, i)}/>
                    </div>
                }else {
                        return <div key={i}>
                           <TextField InputLabelProps={{ shrink: true }}  multiline={true} label={key} value='' sx={{mb: 3, whiteSpace: "initial"}}
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
            'https://bot2-production-a1b8.up.railway.app:8080/artifact/update',
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
                        <ArtifactInteractiveElement ref={this.interactiveElement}/>
                    </Grid>
                </Grid>
            </Box>
        );
    }
}
