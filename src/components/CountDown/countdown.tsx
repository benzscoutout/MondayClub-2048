
import React from 'react';
import Countdown from 'react-countdown';
import { render } from 'react-dom';
import config from '../../config';
import { useGlobalState } from '../state';
const timerCount = Number(config.timer) * 60000 + 1000;

class CountDownComp extends React.Component {
    constructor(props: any) {
        super(props);
        this.state = {
            isEndGame: false
        }

        this.rendererReveal = this.rendererReveal.bind(this);
    }
    rendererReveal({ days, hours, minutes, seconds, completed }: any) {

        if (completed) {
            this.setState({
                isEndGame: true
            })

            return (
                <div className="text-timer-control">
                    <span className="text-timer">Timer</span>
                    <span className="text-time-left">{minutes} : {seconds}</span>
                </div>
            )
        } else {
            return (
                <div className="text-timer-control">
                    <span className="text-timer">Timer</span>
                    <span className="text-time-left">{minutes} : {
                        seconds > 9 ? seconds : "0" + seconds
                    }</span>
                </div>
            )
        }


    }
    render() {
        return (
            <>
                <Countdown
                    date={Date.now() + timerCount}
                    intervalDelay={0}
                    precision={3}
                    renderer={this.rendererReveal}
                />

            </>
        )
    }

}

export default CountDownComp;