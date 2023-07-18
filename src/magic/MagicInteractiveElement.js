import React from "react";
import {Card, CardContent, TextField, Typography} from "@mui/material";
import ReactMarkdown from "react-markdown";
import Carousel from 'better-react-carousel'
import Grid from "@mui/material/Grid";


/**
 * Этот класс представляет собой карточку с информацией для пользователя об объекте.
 * В админской консоли он постоянно перехватывает изменения формы и показывает у себя.
 */

export default class InteractiveElementInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgIndex: 0,
            values: {}
        };
    }

    handlePassedData(passedValues) {
        this.setState({
            values: passedValues
        })
    }


    createCarouselData() {
        if (this.state.values['photoUrls'] !== undefined && this.state.values['photoUrls'].length > 0) {

            let values = [].concat(Object.entries(this.state.values).filter(([k, v]) => k === 'photoUrls')[0][1])
            let mappedValues = String(values).split(',').map((value) =>
                <Carousel.Item>
                    <img
                        width={380}
                        height={350}
                        src={value}
                    />
                </Carousel.Item>)

            return (
                <Carousel rows={1} cols={1} showArrows={true} showThumbs={false}>
                    {mappedValues}
                </Carousel>);
        }
    }

    createUI() {
        return Object.entries(this.state.values)
            .filter(([k, v]) => (v != null) && (v !== '') && (k !== 'photoUrls') && (k !== 'uuid') && (k !== 'alliance'))
            .map(([key, value], i) =>
                {
                    if(key === 'spellName') {
                        return <div key={i}>
                            <Typography gutterBottom variant="h5" component="div">
                                {'Название'}
                            </Typography>
                            <pre>
                        <Typography sx={{whiteSpace: "initial", wordBreak: "break-word"}} paragraph variant="body2"
                                    color="text.secondary">
                            <ReactMarkdown>{String(value)}</ReactMarkdown>
                        </Typography>
                    </pre>
                        </div>
                    }
                    if(key === 'itemDescription') {
                        return <div key={i}>
                            <Typography gutterBottom variant="h5" component="div">
                                {'Описание'}
                            </Typography>
                            <pre>
                        <Typography sx={{whiteSpace: "initial", wordBreak: "break-word"}} paragraph variant="body2"
                                    color="text.secondary">
                            <ReactMarkdown>{String(value)}</ReactMarkdown>
                        </Typography>
                    </pre>
                        </div>
                    }
                    if(key === 'level') {
                        return <div key={i}>
                            <Typography gutterBottom variant="h5" component="div">
                                {'Уровень'}
                            </Typography>
                            <pre>
                        <Typography sx={{whiteSpace: "initial", wordBreak: "break-word"}} paragraph variant="body2"
                                    color="text.secondary">
                            <ReactMarkdown>{String(value)}</ReactMarkdown>
                        </Typography>
                    </pre>
                        </div>
                    }
                }
            )
    }


    render() {
        return (
            <Card sx={{mb: 3, maxWidth: 500, minWidth: 275, maxHeight: '90vh'}}>
                <CardContent>
                    <Typography variant="h5" component="div">
                        "Карточка пользователя"
                    </Typography>
                    {this.createCarouselData()}
                    <Grid item xs={12} sx={{ maxHeight: '50vh', overflowY: 'scroll'}}>
                        {this.createUI()}
                    </Grid>
                </CardContent>
            </Card>

        );
    }
}